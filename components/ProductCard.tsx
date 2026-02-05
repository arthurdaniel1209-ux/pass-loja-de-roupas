
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variant: 'classic' | 'levelUp' | 'passTheLevel' | 'passSports';
  onProductSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant, onProductSelect }) => {
  const frameClasses = variant === 'classic'
    ? 'p-2 border border-neutral-800 group-hover:border-white transition-colors duration-300'
    : '';

  return (
    <button onClick={() => onProductSelect(product)} className="group text-center text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-sm">
      <div className={frameClasses}>
        <div className="overflow-hidden aspect-[4/5]">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
