// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { ChevronLeft, ChevronRight, MessageSquare, Quote, ChevronDown, ChevronUp } from 'lucide-react';
// import { motion } from 'framer-motion';

// const ReviewsSection = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [expandedReviews, setExpandedReviews] = useState({});
//   const sectionRef = useRef(null);

//   const visibleReviews = 3; // Number of reviews visible at once
//   const maxCharacters = 150; // Maximum characters to display before truncating

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews`);
//         setReviews(res.data.filter(review => review.isActive));
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//         setError('Failed to load guest stories');
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   const handlePrevious = () => {
//     setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
//   };

//   const handleNext = () => {
//     setCurrentIndex(prev => (prev + visibleReviews < reviews.length ? prev + 1 : prev));
//   };

//   // Toggle expanded state for a review
//   const toggleExpanded = (reviewId) => {
//     setExpandedReviews(prev => ({
//       ...prev,
//       [reviewId]: !prev[reviewId]
//     }));
//   };

//   // Function to display truncated text with a "Read more" button
//   const renderReviewText = (review, index) => {
//     // Create a unique ID for each review
//     const id = `review-${index}-${review._id || Math.random().toString()}`;
//     const isExpanded = expandedReviews[id];
//     const description = review.description || '';
//     const shouldTruncate = description.length > maxCharacters;
    
//     if (!shouldTruncate) {
//       return <p className="text-gray-700 font-body text-base italic break-words">"{description}"</p>;
//     }
    
//     return (
//       <div className="w-full">
//         <p className="text-gray-700 font-body text-base italic break-words">
//           {isExpanded 
//             ? `"${description}"` 
//             : `"${description.substring(0, maxCharacters)}..."`
//           }
//         </p>
//         <button 
//           onClick={(e) => {
//             e.stopPropagation();
//             toggleExpanded(id);
//           }}
//           className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//         >
//           {isExpanded ? (
//             <>
//               Show less <ChevronUp size={16} className="ml-1" />
//             </>
//           ) : (
//             <>
//               Read more <ChevronDown size={16} className="ml-1" />
//             </>
//           )}
//         </button>
//       </div>
//     );
//   };

//   // Generate star rating display with animation
//   const renderStars = (rating) => {
//     return Array(5).fill(0).map((_, index) => (
//       <motion.span 
//         key={index} 
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: index * 0.1 }}
//         className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
//       >
//         ★
//       </motion.span>
//     ));
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { 
//         type: "spring", 
//         damping: 15,
//         stiffness: 80
//       }
//     }
//   };

//   const headerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { 
//         duration: 0.6,
//         ease: "easeOut"
//       } 
//     }
//   };

//   if (loading) {
//     return (
//       <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
//         <div className="container mx-auto px-8 md:px-12 lg:px-16">
//           <div className="flex justify-between items-start mb-10">
//             <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col animate-pulse">
//                 <div className="h-4 w-28 bg-gray-200 rounded-md mb-4"></div>
//                 <div className="h-24 w-full bg-gray-200 rounded-md mb-6"></div>
//                 <div className="flex items-center mt-auto">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
//                   <div>
//                     <div className="h-4 w-24 bg-gray-200 rounded-md mb-2"></div>
//                     <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
//         <div className="container mx-auto px-8 md:px-12 lg:px-16">
//           <div className="text-left text-red-500 font-body p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
//             <p className="flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               {error}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (reviews.length === 0) {
//     return null; // Don't show section if no reviews
//   }

//   return (
//     <div 
//       ref={sectionRef}
//       className="py-16 relative overflow-hidden"
//       style={{
//         background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)"
//       }}
//     >
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
//         <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-200/30 blur-2xl"></div>
//         <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-200/30 blur-3xl"></div>
//         <div className="absolute -bottom-32 right-1/3 w-72 h-72 rounded-full bg-purple-200/20 blur-3xl"></div>
//         <div className="absolute top-1/4 right-1/4">
//           <Quote size={120} className="text-blue-100/40 transform rotate-12" />
//         </div>
//       </div>
      
//       <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
//           <motion.div 
//             initial="hidden"
//             animate="visible"
//             variants={headerVariants}
//             className="text-left mb-6 md:mb-0"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-2 text-left">
//               Happy Guest <span className="text-blue-600">Stories</span>
//             </h2>
//             <p className="text-gray-600 font-body text-left">
//               See why Nivaas is the preferred choice for luxury stays
//             </p>
//           </motion.div>
          
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
//             className="flex space-x-3"
//           >
//             <motion.button 
//               onClick={handlePrevious}
//               disabled={currentIndex === 0}
//               whileHover={currentIndex !== 0 ? { scale: 1.05, backgroundColor: "#3b82f6", color: "#ffffff" } : {}}
//               whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
//               className={`p-2 rounded-full shadow-md ${
//                 currentIndex === 0 
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                   : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
//               }`}
//               aria-label="Previous"
//             >
//               <ChevronLeft size={20} />
//             </motion.button>
//             <motion.button 
//               onClick={handleNext}
//               disabled={currentIndex + visibleReviews >= reviews.length}
//               whileHover={currentIndex + visibleReviews < reviews.length ? { scale: 1.05, backgroundColor: "#3b82f6", color: "#ffffff" } : {}}
//               whileTap={currentIndex + visibleReviews < reviews.length ? { scale: 0.95 } : {}}
//               className={`p-2 rounded-full shadow-md ${
//                 currentIndex + visibleReviews >= reviews.length 
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                   : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
//               }`}
//               aria-label="Next"
//             >
//               <ChevronRight size={20} />
//             </motion.button>
//           </motion.div>
//         </div>
        
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           {reviews.slice(currentIndex, currentIndex + visibleReviews).map((review, index) => {
//             // Create unique ID for this review card
//             const reviewId = `review-${index}-${review._id || Math.random().toString()}`;
//             const isExpanded = expandedReviews[reviewId];
            
//             return (
//               <motion.div 
//                 key={reviewId}
//                 variants={itemVariants}
//                 onHoverStart={() => setHoveredIndex(index)}
//                 onHoverEnd={() => setHoveredIndex(null)}
//                 className="flex flex-col h-full"
//               >
//                 <div 
//                   className={`bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100/80 flex flex-col relative overflow-visible transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
//                     isExpanded ? 'z-20' : ''
//                   }`}
//                   style={{
//                     background: hoveredIndex === index 
//                       ? "linear-gradient(to bottom right, white, #f8fafc, #f0f7ff)" 
//                       : "white",
//                     height: isExpanded ? 'auto' : '',
//                     minHeight: '100%'
//                   }}
//                 >
//                   {/* Decorative quote element */}
//                   <div className="absolute -top-2 -right-2 text-blue-100 transform rotate-12">
//                     <Quote size={40} />
//                   </div>
                  
//                   <div className="flex mb-3 relative z-10">
//                     {renderStars(review.rating)}
//                   </div>
                  
//                   <div className="mb-6 flex-grow relative z-10 w-full overflow-visible">
//                     {renderReviewText(review, index)}
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative z-10">
//                     <div className="flex items-center">
//                       <div className="relative">
//                         <img 
//                           src={review.profilePicture || 'https://via.placeholder.com/40'} 
//                           alt={review.userName} 
//                           className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
//                         />
//                         {hoveredIndex === index && (
//                           <motion.div 
//                             className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1"
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ type: "spring", stiffness: 500, damping: 15 }}
//                           >
//                             <MessageSquare size={10} className="text-white" />
//                           </motion.div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium font-body text-gray-900">{review.userName}</p>
//                         <p className="text-gray-500 text-sm font-body">{review.city}</p>
//                       </div>
//                     </div>
                    
//                     {/* Reference App Logo - Now in a circle just like profile picture */}
//                     {review.referenceApp?.logo && (
//                       <div className="ml-auto">
//                         <img 
//                           src={review.referenceApp.logo} 
//                           alt={review.referenceApp.name || "Reference App"} 
//                           className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
//                           title={review.referenceApp.name || ""}
//                         />
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Bottom accent */}
//                   <div 
//                     className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 origin-left transition-transform duration-300"
//                     style={{
//                       transform: hoveredIndex === index ? 'scaleX(1)' : 'scaleX(0)'
//                     }}
//                   ></div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsSection;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, MessageSquare, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const sectionRef = useRef(null);

  const visibleReviews = 3; // Number of reviews visible at once
  const maxCharacters = 150; // Maximum characters to display before truncating

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews`);
        setReviews(res.data.filter(review => review.isActive));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load guest stories');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + visibleReviews < reviews.length ? prev + 1 : prev));
  };

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
    const shouldTruncate = description.length > maxCharacters;
    
    if (!shouldTruncate) {
      return <p className="text-gray-700 font-body text-base italic text-left break-words">"{description}"</p>;
    }
    
    return (
      <div className="w-full">
        <p className="text-gray-700 font-body text-base italic text-left break-words">
          {isExpanded 
            ? `"${description}"` 
            : `"${description.substring(0, maxCharacters)}..."`
          }
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded(id);
          }}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              Read more <ChevronDown size={16} className="ml-1" />
            </>
          )}
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

  // Animation variants
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
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)"
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-200/30 blur-2xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4">
          <Quote size={120} className="text-blue-100/40 transform rotate-12" />
        </div>
      </div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-left mb-6 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-2 text-left">
              Happy Guest <span className="text-blue-600">Stories</span>
            </h2>
            <p className="text-gray-600 font-body text-left">
              See why Nivaas is the preferred choice for luxury stays
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="flex space-x-3"
          >
            <motion.button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              whileHover={currentIndex !== 0 ? { scale: 1.05, backgroundColor: "#3b82f6", color: "#ffffff" } : {}}
              whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full shadow-md ${
                currentIndex === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              onClick={handleNext}
              disabled={currentIndex + visibleReviews >= reviews.length}
              whileHover={currentIndex + visibleReviews < reviews.length ? { scale: 1.05, backgroundColor: "#3b82f6", color: "#ffffff" } : {}}
              whileTap={currentIndex + visibleReviews < reviews.length ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full shadow-md ${
                currentIndex + visibleReviews >= reviews.length 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.slice(currentIndex, currentIndex + visibleReviews).map((review, index) => {
            // Create unique ID for this review card
            const reviewId = `review-${index}-${review._id || Math.random().toString()}`;
            const isExpanded = expandedReviews[reviewId];
            
            return (
              <motion.div 
                key={reviewId}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="flex flex-col h-full"
              >
                <div 
                  className={`bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100/80 flex flex-col relative transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                    isExpanded ? 'z-20' : ''
                  }`}
                  style={{
                    background: hoveredIndex === index 
                      ? "linear-gradient(to bottom right, white, #f8fafc, #f0f7ff)" 
                      : "white",
                    height: isExpanded ? 'auto' : '',
                    minHeight: '100%',
                    maxHeight: isExpanded ? 'none' : '100%',
                    overflow: 'visible'
                  }}
                >
                  {/* Decorative quote element */}
                  <div className="absolute -top-2 -right-2 text-blue-100 transform rotate-12">
                    <Quote size={40} />
                  </div>
                  
                  <div className="flex mb-3 relative z-10 text-left">
                    {renderStars(review.rating)}
                  </div>
                  
                  <div className="mb-6 flex-grow relative z-10 w-full">
                    {renderReviewText(review, index)}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 relative z-10">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={review.profilePicture || 'https://via.placeholder.com/40'} 
                          alt={review.userName} 
                          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                        />
                        {hoveredIndex === index && (
                          <motion.div 
                            className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <MessageSquare size={10} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-medium font-body text-gray-900">{review.userName}</p>
                        <p className="text-gray-500 text-sm font-body">{review.city}</p>
                      </div>
                    </div>
                    
                    {/* Reference App Logo - Now in a circle just like profile picture */}
                    {review.referenceApp?.logo && (
                      <div className="ml-auto">
                        <img 
                          src={review.referenceApp.logo} 
                          alt={review.referenceApp.name || "Reference App"} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          title={review.referenceApp.name || ""}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom accent */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 origin-left transition-transform duration-300"
                    style={{
                      transform: hoveredIndex === index ? 'scaleX(1)' : 'scaleX(0)'
                    }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewsSection;