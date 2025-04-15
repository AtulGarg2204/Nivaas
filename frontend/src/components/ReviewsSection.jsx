import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviewsPerView, setReviewsPerView] = useState(3); // Default for desktop
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  // Array of background colors for default profile pictures
  const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500", 
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-amber-500"
  ];

  // Function to get review source icon
  const getReviewSourceIcon = (source) => {
    switch(source) {
      case 'airbnb':
        return '/airbnb.png';
      case 'makemytrip':
        return '/makemytrip.png';
      case 'goibibo':
        return '/goibibo.png';
      case 'google':
        return '/google.png';
      default:
        return null;
    }
  };

  // Function to get a deterministic color based on the username
  const getRandomColor = (name) => {
    if (!name) return bgColors[0];
    
    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to pick a color - ensure we pick a different color for the same name
    const colorIndex = Math.abs(hash) % bgColors.length;
    return bgColors[colorIndex];
  };

  // Function to get first letter of name
  const getInitial = (name) => {
    if (!name || name.length === 0) return "??";
    
    // If name has at least 2 characters, return first 2
    if (name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    
    // If name has only 1 character, return it
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Fetch both reviews and properties to get property names
        const [reviewsRes, propertiesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/reviews`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/properties`)
        ]);
        
        // Create a map of property IDs to property names
        const propertyMap = {};
        propertiesRes.data.forEach(property => {
          propertyMap[property._id] = property.name;
        });
        
        // Add property name to each review
        const reviewsWithPropertyNames = reviewsRes.data.map(review => ({
          ...review,
          propertyName: review.propertyName || (review.propertyId && propertyMap[review.propertyId] 
                        ? propertyMap[review.propertyId] 
                        : 'Unknown Property')
        }));
        
        setReviews(reviewsWithPropertyNames.filter(review => review.isActive));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load guest stories');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to update reviews per view based on screen size
  const updateReviewsPerView = () => {
    if (window.innerWidth < 768) {
      setReviewsPerView(1); // Mobile: 1 review
    } else if (window.innerWidth < 1024) {
      setReviewsPerView(2); // Tablet: 2 reviews
    } else {
      setReviewsPerView(3); // Desktop: 3 reviews
    }
  };

  // Initialize and listen for window resize
  useEffect(() => {
    updateReviewsPerView();
    window.addEventListener('resize', updateReviewsPerView);
    
    return () => {
      window.removeEventListener('resize', updateReviewsPerView);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // Calculate the width of a single review card plus its margin
      const container = current;
      const cards = container.querySelectorAll('.review-card');
      if (!cards.length) return;
      
      const cardWidth = cards[0]?.offsetWidth;
      const cardMargin = 24; // Gap between cards (from the gap-6 class)
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
        newIndex = Math.min(reviews.length - reviewsPerView, activeIndex + 1);
        setActiveIndex(newIndex);
        container.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Calculate if we need to show navigation arrows
  // Only show arrows if there are more reviews than cards per view
  const shouldShowArrows = reviews.length > reviewsPerView;
  
  // Calculate max scroll index
  const maxScrollIndex = reviews.length - reviewsPerView;

  // Toggle expanded state for a review
  const toggleExpanded = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Function to display truncated text with a "Read more" button
  const renderReviewText = (review, index) => {
    // Create a unique ID for each review
    const id = `review-${index}-${review._id || Math.random().toString()}`;
    const isExpanded = expandedReviews[id];
    const description = review.description || '';
    
    // Always truncate initially to keep cards smaller
    if (!isExpanded) {
      // Show only first 1-2 lines (approximately 100 characters)
      const truncatedText = description.length > 100 ? 
        `${description.substring(0, 100)}...` : 
        description;
      
      return (
        <div className="w-full">
          <p className="text-gray-700 font-body text-base italic text-left break-words">"{truncatedText}"</p>
          {description.length > 100 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(id);
              }}
              className="mt-2 text-[#ad8b3a] hover:text-[#a0936a] text-sm font-medium flex items-center"
            >
              Read more <ChevronDown size={16} className="ml-1" />
            </button>
          )}
        </div>
      );
    }
    
    // Expanded state
    return (
      <div className="w-full">
        <p className="text-gray-700 font-body text-base italic text-left break-words">"{description}"</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded(id);
          }}
          className="mt-2 text-[#ad8b3a] hover:text-[#a0936a] text-sm font-medium flex items-center"
        >
          Show less <ChevronUp size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  // Generate star rating display with animation
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <motion.span 
        key={index} 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </motion.span>
    ));
  };

  // Get card width based on reviews per view
  const getCardWidth = () => {
    const gapPercentage = (reviewsPerView - 1) * 24 / reviewsPerView; // account for gaps
    return `calc(${100 / reviewsPerView}% - ${gapPercentage}px)`;
  };

  // Updated renderAvatar function with custom positioning for source icon
const renderAvatar = (review, index) => {
  if (review.profilePicture) {
    return (
      <div className="relative">
        <img 
          src={review.profilePicture} 
          alt={review.userName} 
          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
        />
        {/* Source icon overlay - custom positioning */}
        {review.source && getReviewSourceIcon(review.source) && (
          <div 
            className="absolute w-6 h-6 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-white"
            style={{
              bottom: "-5px",
              right: "0.8rem"
            }}
          >
            <img 
              src={getReviewSourceIcon(review.source)} 
              alt={review.source}
              className="w-5 h-5 object-cover" 
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '50%'
              }}
            />
          </div>
        )}
      </div>
    );
  } else {
    // Get first two characters of username 
    const initial = getInitial(review.userName);
    
    // Use the same random color generation approach as PropertyDetails
    const randomColor = getRandomColor(review.userName + index);
    
    return (
      <div className="relative">
        <div className={`w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm flex items-center justify-center ${randomColor} text-white font-bold text-lg`}>
          {initial}
        </div>
        {/* Source icon overlay - custom positioning */}
        {review.source && getReviewSourceIcon(review.source) && (
          <div 
            className="absolute w-6 h-6 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-white"
            style={{
              bottom: "-5px",
              right: "0.8rem"
            }}
          >
            <img 
              src={getReviewSourceIcon(review.source)} 
              alt={review.source}
              className="w-5 h-5 object-cover" 
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '50%'
              }}
            />
          </div>
        )}
      </div>
    );
  }
};


  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 80
      }
    }
  };

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

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-start mb-10">
            <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col animate-pulse">
                <div className="h-4 w-28 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-24 w-full bg-gray-200 rounded-md mb-6"></div>
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
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
      <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
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

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <div 
      ref={sectionRef}
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #f0f0f0 100%)"
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gray-300/30 blur-2xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-gray-300/30 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 rounded-full bg-gray-300/20 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4">
          <Quote size={120} className="text-gray-200/40 transform rotate-12" />
        </div>
      </div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl md:text-4xl font-normal font-heading text-[#13130F] text-left">
                HAPPY GUEST <span className="text-[#a0936a]">STORIES</span>
              </h2>
              
              {/* Mobile navigation arrows */}
              {shouldShowArrows && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                  className="flex space-x-3 ml-4 md:hidden"
                >
                  <motion.button 
                    onClick={() => scroll('left')}
                    disabled={activeIndex === 0}
                    whileHover={activeIndex !== 0 ? { scale: 1.05, backgroundColor: "#ad8b3a", color: "#ffffff" } : {}}
                    whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
                    className={`p-2 rounded-full shadow-md cursor-pointer ${
                      activeIndex === 0 
                        ? 'bg-gray-100 text-gray-300 opacity-50' 
                        : 'bg-white text-[#ad8b3a] hover:bg-[#ad8b3a] hover:text-white transition-all duration-300'
                    }`}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button 
                    onClick={() => scroll('right')}
                    disabled={activeIndex >= maxScrollIndex}
                    whileHover={activeIndex < maxScrollIndex ? { scale: 1.05, backgroundColor: "#ad8b3a", color: "#ffffff" } : {}}
                    whileTap={activeIndex < maxScrollIndex ? { scale: 0.95 } : {}}
                    className={`p-2 rounded-full shadow-md cursor-pointer ${
                      activeIndex >= maxScrollIndex 
                        ? 'bg-gray-100 text-gray-300 opacity-50' 
                        : 'bg-white text-[#ad8b3a] hover:bg-[#ad8b3a] hover:text-white transition-all duration-300'
                    }`}
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </motion.div>
              )}
            </div>
            <p className="text-gray-600 font-body text-left mt-2 pl-0.5">
              See why NIVAAS is the preferred choice for luxury <span className="text-[#a0936a]">stays</span>
            </p>
          </motion.div>
          
          {/* Desktop navigation arrows */}
          {shouldShowArrows && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              className="hidden md:flex space-x-3 mt-4 md:mt-2"
            >
              <motion.button 
                onClick={() => scroll('left')}
                disabled={activeIndex === 0}
                whileHover={activeIndex !== 0 ? { scale: 1.05, backgroundColor: "#ad8b3a", color: "#ffffff" } : {}}
                whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
                className={`p-2 rounded-full shadow-md cursor-pointer ${
                  activeIndex === 0 
                    ? 'bg-gray-100 text-gray-300 opacity-50' 
                    : 'bg-white text-[#ad8b3a] hover:bg-[#ad8b3a] hover:text-white transition-all duration-300'
                }`}
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button 
                onClick={() => scroll('right')}
                disabled={activeIndex >= maxScrollIndex}
                whileHover={activeIndex < maxScrollIndex ? { scale: 1.05, backgroundColor: "#ad8b3a", color: "#ffffff" } : {}}
                whileTap={activeIndex < maxScrollIndex ? { scale: 0.95 } : {}}
                className={`p-2 rounded-full shadow-md cursor-pointer ${
                  activeIndex >= maxScrollIndex 
                    ? 'bg-gray-100 text-gray-300 opacity-50' 
                    : 'bg-white text-[#ad8b3a] hover:bg-[#ad8b3a] hover:text-white transition-all duration-300'
                }`}
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </div>
        
        <div className="relative px-4" style={{ overflow: 'hidden' }}>
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar py-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory' // Add snap scrolling
            }}
          >
            {reviews.map((review, index) => {
              // Create unique ID for this review card
              const reviewId = `review-${index}-${review._id || Math.random().toString()}`;
              const isExpanded = expandedReviews[reviewId];
              
              return (
              // Update this part of the JSX in your ReviewsSection component
// Replace the review card's div element with this version

<motion.div 
  key={reviewId}
  variants={itemVariants}
  initial="hidden"
  animate="visible"
  className="review-card"
  style={{ 
    width: getCardWidth(),
    flexShrink: 0,
    scrollSnapAlign: 'start', // Snap to start of card
    isolation: isExpanded ? 'isolate' : 'auto'
  }}
>
  <div 
    className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 flex flex-col relative transform transition-all duration-500 hover:-translate-y-1 h-full"
    style={{
      background: "white",
      overflow: 'visible',
      transition: 'all 0.3s ease',
      zIndex: isExpanded ? 10 : 1
    }}
  >
    {/* Decorative quote element */}
    <div className="absolute -top-2 -right-2 text-gray-200 transform rotate-12">
      <Quote size={40} />
    </div>
    
    <div className="flex mb-3 relative z-10 text-left">
      {renderStars(review.rating)}
    </div>
    
    <div className={`mb-6 flex-grow relative z-10 w-full ${isExpanded ? 'expanded-content' : ''}`}>
      {renderReviewText(review, index)}
    </div>
    
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative z-10">
      <div className="flex items-center">
        {renderAvatar(review, index)}
        <div className="text-left">
          <p className="font-medium font-body text-gray-900">{review.userName}</p>
          <p className="text-gray-500 text-sm font-body">{review.propertyName}</p>
          <p className="text-gray-400 text-xs font-body">{review.city}</p>
        </div>
      </div>
    </div>
  </div>
</motion.div>
              );
            })}
          </div>
        </div>
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

export default ReviewsSection;