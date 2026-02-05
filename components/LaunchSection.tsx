
import React from 'react';
import ProductGrid from './ProductGrid';
import type { Product } from '../types';

interface LaunchSectionProps {
  id: string;
  title: string;
  products: Product[];
  variant: 'classic' | 'levelUp' | 'passTheLevel' | 'passSports';
  onProductSelect: (product: Product) => void;
}

const titleStyles: { [key: string]: string } = {
  classic: 'font-logo-pass tracking-widest text-5xl',
  levelUp: 'font-extrabold uppercase tracking-[0.2em]',
  passTheLevel: 'font-mono uppercase tracking-widest font-bold',
  passSports: 'font-black italic uppercase tracking-wider',
};

const sectionStyles: { [key: string]: string } = {
  classic: 'bg-black',
  levelUp: 'bg-gradient-to-b from-gray-900 to-black',
  passTheLevel: 'bg-black border-y-2 border-dashed border-gray-700',
  passSports: 'bg-zinc-900',
};


const LaunchSection: React.FC<LaunchSectionProps> = ({ id, title, products, variant, onProductSelect }) => {
  const titleClass = titleStyles[variant] || titleStyles.classic;
  const sectionClass = sectionStyles[variant] || sectionStyles.classic;

  return (
    <section id={id} className={`py-16 ${sectionClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl text-white transition-all duration-300 ${titleClass}`}>
            {title}
          </h2>
        </div>
        <ProductGrid products={products} variant={variant} onProductSelect={onProductSelect} />
      </div>
    </section>
  );
};

export default LaunchSection;
