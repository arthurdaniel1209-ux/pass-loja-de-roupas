
import React from 'react';
import type { Product } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

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
    <motion.button 
      id={`product-card-${product.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onProductSelect(product)} 
      className="group text-center text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white rounded-sm"
    >
      <div className={cn(frameClasses)}>
        <div className="overflow-hidden aspect-[4/5] relative">
          <img 
            id={`product-image-${product.id}`}
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            referrerPolicy="no-referrer"
          />
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">
              New
            </span>
          )}
        </div>
        <div className="mt-4 text-left">
          <h3 className="text-sm text-gray-400 uppercase tracking-wider truncate">{product.name}</h3>
          <p className="mt-1 text-lg font-bold text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export default ProductCard;
