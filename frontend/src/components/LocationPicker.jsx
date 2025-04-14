import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationPicker = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(5); // Default for desktop
  const [showDots, setShowDots] = useState(false); // Control visibility of dots

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
        setCities(res.data.filter(city => city.isActive));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to load destinations');
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Function to update cards per view based on screen size
  const updateCardsPerView = () => {
    if (window.innerWidth < 640) {
      setCardsPerView(2); // Mobile: 2 cards
      setShowDots(true); // Show dots on mobile
    } else if (window.innerWidth < 768) {
      setCardsPerView(2); // Small tablets: 2 cards
      setShowDots(true); // Show dots on small tablets
    } else if (window.innerWidth < 1024) {
      setCardsPerView(3); // Tablets: 3 cards
      setShowDots(true); // Show dots on tablets
    } else {
      setCardsPerView(5); // Desktop: 5 cards
      setShowDots(false); // Hide dots on desktop
    }
  };

  // Initialize and listen for window resize
  useEffect(() => {
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    
    return () => {
      window.removeEventListener('resize', updateCardsPerView);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Calculate the width of a single card plus its margin
      const container = current;
      const cards = container.querySelectorAll('.location-card');
      if (!cards.length) return;
      
      const cardWidth = cards[0]?.offsetWidth;
      const cardMargin = 16; // Gap between cards (from the gap-4 class)
      const scrollAmount = cardWidth + cardMargin;
      
      let newIndex = activeIndex;
      if (direction === 'left') {
        newIndex = Math.max(0, activeIndex - 1);
        setActiveIndex(newIndex);
        container.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth'
        });
      } else {
        newIndex = Math.min(cities.length - cardsPerView, activeIndex + 1);
        setActiveIndex(newIndex);
        container.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left px-4">
            <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="mt-8 flex gap-4 px-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1">
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left text-red-500 font-body p-6 bg-red-50 rounded-lg shadow-sm px-4">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate card width based on cards per view
  const getCardWidth = () => {
    const gapPercentage = (cardsPerView - 1) * 16 / cardsPerView; // account for gaps
    return `calc(${100 / cardsPerView}% - ${gapPercentage}px)`;
  };

  // Calculate if we need to show dots
  // Only show dots if there are more cities than cards per view
  const shouldShowDots = showDots && cities.length > cardsPerView;
  
  // Calculate max number of dots needed
  const maxScrollIndex = cities.length - cardsPerView;
  const numDots = maxScrollIndex + 1;

  // Header animation variants similar to ReviewsSection
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  // Render card content based on showOnHome status
  const renderCardContent = (city) => {
    const cardContent = (
      <div className={`overflow-hidden rounded-xl shadow-lg ${!city.showOnHome ? 'bg-gray-100' : 'bg-white'}`}>
        <div className="aspect-[4/3] overflow-hidden relative">
          {/* Gray overlay for disabled cards */}
          <div className={`absolute inset-0 z-10 ${!city.showOnHome ? 'bg-black/50' : 'bg-black/30'}`}></div>
          
          <img 
            src={city.image} 
            alt={city.name} 
            className={`w-full h-full object-cover transition-transform duration-500 ${city.showOnHome ? 'group-hover:scale-105' : 'filter grayscale'}`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20"></div>
          
          <div className="absolute inset-0 flex items-end z-30">
            <div className="p-4 w-full">
              {/* Changed from font-heading to font-subheading with font-medium for city names */}
              <h3 className="text-white text-lg font-medium font-subheading mb-1">
                {city.name}
              </h3>
              {/* Regular text remains font-body with font-normal (default) */}
              <p className="text-white/90 text-xs font-body">
                {city.showOnHome 
                  ? `Discover amazing places in ${city.name}`
                  : "Coming soon"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    if (city.showOnHome) {
      return (
        <Link 
          to={`/city/${city._id}`}
          className="block group"
          style={{ overflow: 'hidden' }}
        >
          {cardContent}
        </Link>
      );
    } else {
      return (
        <div className="cursor-pointer" title="This destination is coming soon">
          {cardContent}
        </div>
      );
    }
  };

  return (
    <div className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-left"
          >
            <div className="flex items-center justify-between">
              {/* Main heading in Cinzel with all capitals and font-weight 400 */}
              <h2 className="text-3xl md:text-4xl font-heading text-gray-800 text-left uppercase tracking-wide">
                PICK YOUR LOCATION
              </h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                className="flex space-x-3 ml-4 md:hidden"
              >
                <motion.button 
                  onClick={() => scroll('left')}
                  disabled={activeIndex === 0}
                  whileHover={activeIndex !== 0 ? { scale: 1.05, backgroundColor: "rgba(14,63,68,0.95)", color: "#ffffff" } : {}}
                  whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
                  className={`p-2 rounded-full shadow-md cursor-pointer ${
                    activeIndex === 0 
                      ? 'bg-gray-100 text-gray-300 opacity-50' 
                      : 'bg-white text-[rgba(14,63,68,0.95)] hover:bg-[rgba(14,63,68,0.95)] hover:text-white transition-all duration-300'
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button 
                  onClick={() => scroll('right')}
                  disabled={activeIndex >= maxScrollIndex}
                  whileHover={activeIndex < maxScrollIndex ? { scale: 1.05, backgroundColor: "rgba(14,63,68,0.95)", color: "#ffffff" } : {}}
                  whileTap={activeIndex < maxScrollIndex ? { scale: 0.95 } : {}}
                  className={`p-2 rounded-full shadow-md cursor-pointer ${
                    activeIndex >= maxScrollIndex 
                      ? 'bg-gray-100 text-gray-300 opacity-50' 
                      : 'bg-white text-[rgba(14,63,68,0.95)] hover:bg-[rgba(14,63,68,0.95)] hover:text-white transition-all duration-300'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            </div>
            {/* Regular text with Inter font-body with default 400 weight */}
            <p className="text-gray-600 font-body text-left mt-2 pl-0.5">
              It's time to travel and explore
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="hidden md:flex space-x-3 mt-4 md:mt-2"
          >
            <motion.button 
              onClick={() => scroll('left')}
              disabled={activeIndex === 0}
              whileHover={activeIndex !== 0 ? { scale: 1.05, backgroundColor: "rgba(14,63,68,0.95)", color: "#ffffff" } : {}}
              whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full shadow-md cursor-pointer ${
                activeIndex === 0 
                  ? 'bg-gray-100 text-gray-300 opacity-50' 
                  : 'bg-white text-[rgba(14,63,68,0.95)] hover:bg-[rgba(14,63,68,0.95)] hover:text-white transition-all duration-300'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              onClick={() => scroll('right')}
              disabled={activeIndex >= maxScrollIndex}
              whileHover={activeIndex < maxScrollIndex ? { scale: 1.05, backgroundColor: "rgba(14,63,68,0.95)", color: "#ffffff" } : {}}
              whileTap={activeIndex < maxScrollIndex ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full shadow-md cursor-pointer ${
                activeIndex >= maxScrollIndex 
                  ? 'bg-gray-100 text-gray-300 opacity-50' 
                  : 'bg-white text-[rgba(14,63,68,0.95)] hover:bg-[rgba(14,63,68,0.95)] hover:text-white transition-all duration-300'
              }`}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
        
        <div className="relative px-4" style={{ overflow: 'hidden' }}>
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar py-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory' // Add snap scrolling
            }}
          >
            {cities.map((city, index) => (
              <div
                key={city._id} 
                className="location-card"
                data-index={index}
                style={{ 
                  width: getCardWidth(),
                  flexShrink: 0,
                  scrollSnapAlign: 'start' // Snap to start of card
                }}
              >
                {renderCardContent(city)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Dots - Only show when needed */}
        {shouldShowDots && (
          <div className="flex justify-center mt-6 px-4">
            {Array.from({ length: numDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cards = scrollContainerRef.current.querySelectorAll('.location-card');
                    if (!cards.length) return;
                    
                    const cardWidth = cards[0]?.offsetWidth;
                    const cardMargin = 16; // From the gap-4 class
                    const scrollAmount = index * (cardWidth + cardMargin);
                    
                    scrollContainerRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                    setActiveIndex(index);
                  }
                }}
                className="mx-1 focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className={`block h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === activeIndex 
                    ? 'bg-[#a0936a]' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}></span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Add custom CSS for hiding scrollbar */}
      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default LocationPicker;