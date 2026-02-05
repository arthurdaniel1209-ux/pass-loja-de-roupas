
import React from 'react';

const CategoryCard: React.FC<{ imageUrl: string; title: string }> = ({ imageUrl, title }) => (
    <div className="group relative">
        <div className="overflow-hidden">
             <img src={imageUrl} alt={title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" />
        </div>
        <h2 className="text-center text-lg uppercase font-bold tracking-wider mt-4">{title}</h2>
    </div>
);

const CategoryShowcase: React.FC = () => {
  return (
    <div className="my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryCard imageUrl="https://picsum.photos/seed/cat1/800/800" title="Drop 6" />
        <CategoryCard imageUrl="https://picsum.photos/seed/cat2/800/800" title="Accessories" />
        <CategoryCard imageUrl="https://picsum.photos/seed/cat3/800/800" title="Shorts" />
      </div>
    </div>
  );
};

export default CategoryShowcase;
