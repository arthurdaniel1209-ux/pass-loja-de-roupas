
import React, { useState } from 'react';
import type { Product } from '../types';

interface ProductPageProps {
  product: Product;
  sectionProducts: Product[];
  onNavigateBack: () => void;
  isLoggedIn: boolean;
  onNavigate: (page: 'auth') => void;
}

const SIZES = ['P', 'M', 'G', 'GG'];
const COLORS = [
    { name: 'Preto', class: 'bg-black' },
    { name: 'Branco', class: 'bg-white' },
    { name: 'Cinza', class: 'bg-gray-500' },
];

const ProductPage: React.FC<ProductPageProps> = ({ product, sectionProducts, onNavigateBack, isLoggedIn, onNavigate }) => {
  const [activeImageUrl, setActiveImageUrl] = useState(product.imageUrl);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [isFading, setIsFading] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleImageSelect = (newUrl: string) => {
    if (newUrl === activeImageUrl) return;

    setIsFading(true);
    setTimeout(() => {
        setActiveImageUrl(newUrl);
        setIsFading(false);
    }, 200); // Duration matches the transition duration
  };

  const currentIndex = sectionProducts.findIndex(p => p.imageUrl === activeImageUrl);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % sectionProducts.length;
    handleImageSelect(sectionProducts[nextIndex].imageUrl);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + sectionProducts.length) % sectionProducts.length;
    handleImageSelect(sectionProducts[prevIndex].imageUrl);
  };
  
  const handleAddToCart = () => {
    if (isLoggedIn) {
      alert('Funcionalidade de carrinho não implementada.');
    } else {
      alert('É necessário estar logado para adicionar itens ao carrinho.');
      onNavigate('auth');
    }
  };

  const handleBuyNow = () => {
    if (isLoggedIn) {
      alert('Funcionalidade de compra não implementada.');
    } else {
      alert('É necessário estar logado para comprar.');
      onNavigate('auth');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={onNavigateBack} className="flex items-center text-gray-300 hover:text-white mb-8 group">
          <svg className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Voltar para a loja
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Coluna da Galeria de Imagens */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto pb-2 sm:overflow-y-auto sm:pr-2">
              {sectionProducts.map(p => (
                <button 
                  key={p.id} 
                  className={`w-16 h-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${activeImageUrl === p.imageUrl ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => handleImageSelect(p.imageUrl)}
                >
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative group flex-1 aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden">
              <img 
                src={activeImageUrl} 
                alt="Produto em destaque" 
                className={`w-full h-full object-cover transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
              />
               <button 
                onClick={handlePrevious}
                className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Imagem anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleNext}
                className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Próxima imagem"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Coluna de Informações do Produto */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">{product.name}</h1>
            <p className="text-3xl md:text-4xl font-logo-pass text-gray-300 my-4">{formatPrice(product.price)}</p>

            <div className="border-t border-gray-800 my-4"></div>

            {/* Seletor de Cor */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Cor: <span className="text-white font-semibold">{selectedColor}</span></h3>
              <div className="flex items-center space-x-3">
                {COLORS.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${selectedColor === color.name ? 'border-white' : 'border-gray-600 hover:border-gray-400'}`}
                    aria-label={`Selecionar cor ${color.name}`}
                  >
                    <span className={`${color.class} h-full w-full block rounded-full`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seletor de Tamanho */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Tamanho</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md transition-colors duration-200 min-w-[50px] text-center ${selectedSize === size ? 'bg-white text-black font-semibold' : 'border-gray-600 hover:bg-neutral-800'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-4">
               <button 
                 onClick={handleAddToCart}
                 className="w-full py-4 px-4 bg-white text-black font-bold uppercase tracking-wider rounded-md hover:bg-gray-300 transition-colors duration-300"
               >
                 Adicionar ao carrinho
               </button>
               <button 
                 onClick={handleBuyNow}
                 className="w-full py-4 px-4 bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-md hover:bg-neutral-700 transition-colors duration-300"
               >
                 Comprar agora
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
