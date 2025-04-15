import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const UnexploredSection = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Number of cards to display at once based on screen size
  const getVisibleCount = () => {
    if (window.innerWidth >= 1280) return 4; // xl screens
    if (window.innerWidth >= 1024) return 3; // lg screens
    if (window.innerWidth >= 768) return 2; // md screens
    return 1; // sm screens
  };
  
  const [visibleCount, setVisibleCount] = useState(3); // Default to avoid SSR issues

  useEffect(() => {
    // Set initial visible count after component mounts to access window
    setVisibleCount(getVisibleCount());
    
    // Handle window resize to adjust visible count
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
        
        // Filter for active cities with things to do
        const activeCities = res.data.filter(city => 
          city.isActive && city.thingsToDo && city.thingsToDo.length > 0
        );
        
        setCities(activeCities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('Failed to load unexplored destinations');
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Create a flat array of all things to do with their city info
  const allThingsToDo = cities.flatMap(city => 
    (city.thingsToDo || []).map(thing => ({
      ...thing,
      cityName: city.name
    }))
  );

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      Math.min(Math.max(0, allThingsToDo.length - visibleCount), prev + 1)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 10 }
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-lg text-left">
              <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col">
                <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 h-full">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left text-red-500 font-body p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
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

  // Don't display the section if no cities have things to do
  if (allThingsToDo.length === 0) {
    return null;
  }

  const visibleItems = allThingsToDo.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-96 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-full h-96 bg-gradient-to-tr from-yellow-500/5 to-red-500/5 rounded-full blur-3xl transform -translate-x-1/2"></div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-heading text-[#13130F] drop-shadow-sm">
              The Unexplored
            </h2>
            <p className="text-gray-600 font-body">
              Discover the most hidden and unexplored destinations, and let us assist you in offering unique stays and camping experiences.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-3"
          >
            <motion.button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              whileHover={currentIndex !== 0 ? { scale: 1.05, backgroundColor: 'rgb(37, 99, 235)' } : {}}
              whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full border shadow-sm ${
                currentIndex === 0 
                  ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                  : 'text-blue-600 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              onClick={handleNext}
              disabled={currentIndex + visibleCount >= allThingsToDo.length}
              whileHover={currentIndex + visibleCount < allThingsToDo.length ? { scale: 1.05, backgroundColor: 'rgb(37, 99, 235)' } : {}}
              whileTap={currentIndex + visibleCount < allThingsToDo.length ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full border shadow-sm ${
                currentIndex + visibleCount >= allThingsToDo.length 
                  ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                  : 'text-blue-600 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300'
              }`}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {visibleItems.map((thing, index) => (
            <motion.div 
              key={thing._id || index} 
              variants={itemVariants}
              className="flex flex-col"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* City name above the card */}
              <div className="text-left mb-2 pl-1">
                <span className="text-blue-600 font-bold font-body">{thing.cityName}</span>
              </div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100/80 flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* Reflection effect on top */}
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/20 to-transparent z-20"></div>
                    
                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent z-10 opacity-40 group-hover:opacity-0 transition-opacity duration-300"></div>
                    
                    <img 
                      src={thing.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={thing.heading || 'Unexplored destination'} 
                      className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-3 left-3 z-30">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full font-body shadow-lg shadow-blue-500/20">
                      Must Visit
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-grow bg-gradient-to-b from-white to-gray-50/70 text-left">
                 
                  <div className="text-[#13130F] text-lg font-bold font-heading mb-3">
                    {thing.heading || 'Unnamed Destination'}
                  </div>
                  <p className="text-gray-600 text-sm font-body line-clamp-3 mb-4">
                    {thing.description || 'No description available'}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer">
                      <span>Learn more</span>
                      <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UnexploredSection;