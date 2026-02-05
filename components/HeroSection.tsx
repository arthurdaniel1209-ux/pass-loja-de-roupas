
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full mb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-[4/5] w-full">
            <img 
              src="https://picsum.photos/seed/pass-store-hero/800/1000" 
              alt="Duas modelos vestindo camisetas da Pass em frente a uma porta de madeira" 
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;