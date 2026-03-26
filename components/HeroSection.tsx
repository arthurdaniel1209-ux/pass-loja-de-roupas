
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full">
            <img 
              src="https://picsum.photos/seed/pass-store-hero/1920/1080" 
              alt="Banner da loja Pass" 
              className="w-full h-full object-cover rounded-lg shadow-xl"
              referrerPolicy="no-referrer"
            />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;