
import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  variant: 'classic' | 'levelUp' | 'passTheLevel' | 'passSports';
  onProductSelect: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, variant, onProductSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 my-12">
      {products.map(product => (
        <ProductCard key={product.id} product={product} variant={variant} onProductSelect={onProductSelect} />
      ))}
    </div>
  );
};

export default ProductGrid;
