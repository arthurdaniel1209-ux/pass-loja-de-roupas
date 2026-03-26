
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LaunchSection from './components/LaunchSection';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import type { Product, CartItem } from './types';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  increment 
} from 'firebase/firestore';

// Product Data for each section
const classicProducts: Product[] = [
  { id: 1, name: 'TEE CLASSIC LOGO BLACK', price: 189.00, imageUrl: 'https://i.imgur.com/lD0tlcH.jpg' },
  { id: 2, name: 'TEE CLASSIC LOGO BLACK', price: 189.00, imageUrl: 'https://i.imgur.com/Om8XA5Y.jpg' },
  { id: 3, name: 'TEE CLASSIC LOGO BLACK', price: 189.00, imageUrl: 'https://i.imgur.com/NLg0FiB.jpg' },
  { id: 4, name: 'TEE CLASSIC LOGO BLACK', price: 189.00, imageUrl: 'https://i.imgur.com/jsso4aS.jpg' },
];

const levelUpProducts: Product[] = [
  { id: 5, name: 'LEVEL UP GRAPHIC TEE', price: 219.00, imageUrl: 'https://picsum.photos/seed/levelup1/800/1000' },
  { id: 6, name: 'NEON WINDBREAKER', price: 429.00, imageUrl: 'https://picsum.photos/seed/levelup2/800/1000' },
  { id: 7, name: 'REFLECTIVE CARGO SHORTS', price: 319.00, imageUrl: 'https://picsum.photos/seed/levelup3/800/1000' },
  { id: 8, name: 'OVERSIZED HOODIE "VOLT"', price: 399.00, imageUrl: 'https://picsum.photos/seed/levelup4/800/1000' },
];

const passTheLevelProducts: Product[] = [
  { id: 9, name: 'GAMER "PIXEL" TEE', price: 229.00, imageUrl: 'https://picsum.photos/seed/levelpass1/800/1000' },
  { id: 10, name: '8-BIT BEANIE', price: 129.00, imageUrl: 'https://picsum.photos/seed/levelpass2/800/1000' },
  { id: 11, name: 'HIGH SCORE SWEATPANTS', price: 359.00, imageUrl: 'https://picsum.photos/seed/levelpass3/800/1000' },
  { id: 12, name: '"CONTINUE?" SOCKS', price: 79.00, imageUrl: 'https://picsum.photos/seed/levelpass4/800/1000' },
];

const passSportsProducts: Product[] = [
  { id: 13, name: 'PERFORMANCE DRY-FIT TEE', price: 249.00, imageUrl: 'https://picsum.photos/seed/sports1/800/1000' },
  { id: 14, name: 'ATHLETIC MESH SHORTS', price: 199.00, imageUrl: 'https://picsum.photos/seed/sports2/800/1000' },
  { id: 15, name: 'SPORT COMPRESSION LEGGINGS', price: 299.00, imageUrl: 'https://picsum.photos/seed/sports3/800/1000' },
  { id: 16, name: 'TRAINING SNEAKERS "FLOW"', price: 699.00, imageUrl: 'https://picsum.photos/seed/sports4/800/1000' },
];


import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'product'>('home');
  const [selectedProductInfo, setSelectedProductInfo] = useState<{ product: Product, sectionProducts: Product[] } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    console.log('App component mounted');
    console.log('isAuthReady:', isAuthReady);
  }, [isAuthReady]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setCheckoutStatus('success');
      // Clear cart locally (optional, since Firestore will be the source of truth)
      // In a real app, you'd probably wait for a webhook to clear the cart in Firestore
    }
    if (query.get('canceled')) {
      setCheckoutStatus('canceled');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser) {
        setCartItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const cartRef = collection(db, 'users', user.uid, 'cart');
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const items = snapshot.docs.map(doc => doc.data() as CartItem);
        setCartItems(items);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/cart`);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleNavigate = (page: 'home' | 'auth') => {
    setCurrentPage(page);
    setSelectedProductInfo(null); 
  };
  
  const handleProductSelect = (product: Product, sectionProducts: Product[]) => {
    setSelectedProductInfo({ product, sectionProducts });
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = async (product: Product, size: string, color: string) => {
    if (!user) {
      handleNavigate('auth');
      return;
    }

    const itemId = `${product.id}-${size}-${color}`;
    const itemRef = doc(db, 'users', user.uid, 'cart', itemId);

    try {
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        await updateDoc(itemRef, {
          quantity: increment(1)
        });
      } else {
        const newItem: CartItem = {
          ...product,
          quantity: 1,
          size,
          color
        };
        await setDoc(itemRef, newItem);
      }
      setIsCartOpen(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/${itemId}`);
    }
  };

  const handleUpdateQuantity = async (id: number, size: string, color: string, delta: number) => {
    if (!user) return;
    const itemId = `${id}-${size}-${color}`;
    const itemRef = doc(db, 'users', user.uid, 'cart', itemId);

    try {
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        const currentQty = docSnap.data().quantity;
        if (currentQty + delta <= 0) {
          await deleteDoc(itemRef);
        } else {
          await updateDoc(itemRef, {
            quantity: increment(delta)
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart/${itemId}`);
    }
  };

  const handleRemoveItem = async (id: number, size: string, color: string) => {
    if (!user) return;
    const itemId = `${id}-${size}-${color}`;
    const itemRef = doc(db, 'users', user.uid, 'cart', itemId);

    try {
      await deleteDoc(itemRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${itemId}`);
    }
  };

  const renderPage = () => {
    if (!isAuthReady) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      );
    }

    switch(currentPage) {
      case 'product':
        return selectedProductInfo && (
          <>
            <Header 
              onNavigate={handleNavigate} 
              isLoggedIn={!!user} 
              onLogout={handleLogout} 
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            />
            <main className="pt-16">
              <ProductPage 
                product={selectedProductInfo.product}
                sectionProducts={selectedProductInfo.sectionProducts}
                onNavigateBack={() => handleNavigate('home')}
                isLoggedIn={!!user}
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
              />
            </main>
          </>
        );
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'home':
      default:
        return (
          <>
            <Header 
              onNavigate={handleNavigate} 
              isLoggedIn={!!user} 
              onLogout={handleLogout} 
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            />
            <main className="pt-16">
              <HeroSection />
              <LaunchSection 
                id="classic" 
                title="Classic" 
                products={classicProducts} 
                variant="classic" 
                onProductSelect={(product) => handleProductSelect(product, classicProducts)}
              />
              <LaunchSection 
                id="level-up" 
                title="Level UP" 
                products={levelUpProducts} 
                variant="levelUp" 
                onProductSelect={(product) => handleProductSelect(product, levelUpProducts)}
              />
              <LaunchSection 
                id="pass-the-level" 
                title="Pass the level" 
                products={passTheLevelProducts} 
                variant="passTheLevel"
                onProductSelect={(product) => handleProductSelect(product, passTheLevelProducts)}
              />
              <LaunchSection 
                id="pass-sports" 
                title="Pass Sports" 
                products={passSportsProducts} 
                variant="passSports" 
                onProductSelect={(product) => handleProductSelect(product, passSportsProducts)}
              />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Toaster position="top-center" richColors />
      {checkoutStatus === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full shadow-lg font-bold animate-bounce">
          Pagamento realizado com sucesso! 🎉
          <button onClick={() => setCheckoutStatus(null)} className="ml-4 text-white/80 hover:text-white">×</button>
        </div>
      )}
      {checkoutStatus === 'canceled' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg font-bold">
          Pagamento cancelado. Tente novamente quando quiser.
          <button onClick={() => setCheckoutStatus(null)} className="ml-4 text-white/80 hover:text-white">×</button>
        </div>
      )}
      {renderPage()}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default App;
