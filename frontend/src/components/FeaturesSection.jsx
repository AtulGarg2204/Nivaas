import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const totalFeatures = 3;
  
  const features = [
    {
      imageSrc: '/features/1.png',
      title: 'Superhost Assurance',
      subtitle: "We're not just hosts, we're Superhosts. 5-star service & fast responses every single time."
    },
    {
      imageSrc: '/features/2.png',
      title: 'Handpicked Homes with Soul',
      subtitle: 'Every property is scouted, styled, and soul-picked because mid-stays are not part of our playlist.'
    },
    {
      imageSrc: '/features/3.png',
      title: 'More Than a Stay, It is a Vibe',
      subtitle: 'Cozy aesthetics, curated comfort, and an Insta-worthy vibe come standard.'
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
          {/* Main heading in Cinzel, all uppercase */}
          <h2 className="text-3xl md:text-4xl font-heading text-[#13130F] text-left uppercase tracking-wide">
            ✨ Why Choose <span className="text-[#a0936a]">Nivaas</span>
          </h2>
          {/* Subheading with font-body (Inter) with normal weight */}
          <p className="text-gray-600 font-body text-left pl-0.5 mt-2 ">
            Because cookie-cutter stays aren't our thing. At Nivaas, every stay is curated with comfort, soul, and a little bit of magic.
          </p>
        </motion.div>
        
        {/* Desktop view - regular grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="h-full">
                <div className="bg-white h-full p-6 rounded-xl border border-gray-200 flex flex-col">
                  <div className="flex items-start space-x-5 relative z-10">
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <img 
                        src={feature.imageSrc} 
                        alt={feature.title} 
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48';
                        }}
                      />
                    </div>
                    
                    <div className="text-left">
                      {/* Changed to font-subheading (Inter) with font-medium (500) */}
                      <h3 className="text-xl font-medium font-subheading text-[#a0936a] mb-2 text-left">
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
                      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                        <img 
                          src={feature.imageSrc} 
                          alt={feature.title} 
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      </div>
                      
                      <div className="text-left">
                        {/* Changed to font-subheading (Inter) with font-medium (500) */}
                        <h3 className="text-lg font-medium font-subheading text-[#a0936a] mb-1 text-left">
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