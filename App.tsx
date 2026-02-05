
import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LaunchSection from './components/LaunchSection';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import type { Product } from './types';

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


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'product'>('home');
  const [selectedProductInfo, setSelectedProductInfo] = useState<{ product: Product, sectionProducts: Product[] } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (page: 'home' | 'auth') => {
    setCurrentPage(page);
    setSelectedProductInfo(null); 
  };
  
  const handleProductSelect = (product: Product, sectionProducts: Product[]) => {
    setSelectedProductInfo({ product, sectionProducts });
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'product':
        return selectedProductInfo && (
          <ProductPage 
            product={selectedProductInfo.product}
            sectionProducts={selectedProductInfo.sectionProducts}
            onNavigateBack={() => handleNavigate('home')}
            isLoggedIn={isLoggedIn}
            onNavigate={handleNavigate}
          />
        );
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
      case 'home':
      default:
        return (
          <>
            <Header onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />
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
      {renderPage()}
    </div>
  );
};

export default App;
