import React, { useState, useEffect, useRef } from 'react';
import { Zap, Globe, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const totalFeatures = 3;
  
  const features = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Exclusive Experiences',
      subtitle: 'Handpicked villas for unforgettable stays'
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Unmatched Service',
      subtitle: 'Dedicated concierge & travel assistance'
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      title: 'Superior Guest Value',
      subtitle: 'Prioritising safety, cleanliness & service'
    }
  ];

  // Start the automatic sliding for mobile
  useEffect(() => {
    // Only run on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalFeatures);
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Animation variants for desktop
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="py-16 relative overflow-hidden bg-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="mb-12 text-left px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-gray-800 text-left">
            Why Choose <span className="text-[#a0936a]">Nivaas</span>
          </h2>
          <p className="text-gray-600 font-body text-left pl-0.5">
            Experience the difference with our premium services and amenities
          </p>
        </motion.div>
        
        {/* Desktop view - regular grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="h-full">
                <div className="bg-white h-full p-6 rounded-xl border border-gray-200 flex flex-col">
                  <div className="flex items-start space-x-5 relative z-10">
                    <div className="p-3 rounded-lg bg-[rgba(14,63,68,0.95)] flex-shrink-0">
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    
                    <div className="text-left">
                      <h3 className="text-xl font-bold font-heading text-[#a0936a] mb-2 text-left">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 font-body text-left pl-0.5">{feature.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view - auto-sliding carousel */}
        <div className="md:hidden overflow-hidden px-4">
          {/* Carousel container */}
          <div className="relative w-full">
            {/* Features container - all features are loaded but only one is visible at a time */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${totalFeatures * 100}%`
              }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white h-full p-5 rounded-xl border border-gray-200 flex flex-col">
                    <div className="flex items-start space-x-4 relative z-10">
                      <div className="p-2 rounded-lg bg-[rgba(14,63,68,0.95)] flex-shrink-0">
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      
                      <div className="text-left">
                        <h3 className="text-lg font-bold font-heading text-[#a0936a] mb-1 text-left">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 font-body text-left text-sm pl-0.5">{feature.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-[#a0936a]' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;