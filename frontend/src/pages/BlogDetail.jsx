import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, MapPin } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [thingsToDoData, setThingsToDoData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Number of cards to display per view
  const cardsPerView = 3;

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 10 }
    }
  };

  // Navigation for things to do cards
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      Math.min(thingsToDoData.length - cardsPerView, prev + 1)
    );
  };

  // Handle mouse movement for gradient effect
  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  // Fetch cities to get the full Things to Do data
  const fetchThingsToDoData = async (thingIds) => {
    try {
      // First, fetch all cities to extract the Things to Do
      const citiesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
      const cities = citiesRes.data;
      
      // Create a map of all things to do with their full details
      const thingsMap = {};
      
      cities.forEach(city => {
        if (city.thingsToDo && city.thingsToDo.length > 0) {
          city.thingsToDo.forEach(thing => {
            // In your schema, image is a string, so we can use it directly
            thingsMap[thing._id] = {
              ...thing,
              cityId: city._id,
              cityName: city.name
            };
          });
        }
      });
      
      // Extract the things to do that match our blog's selected IDs
      const thingsData = thingIds.map(id => thingsMap[id]).filter(Boolean);
      
      return thingsData;
    } catch (error) {
      console.error('Error fetching things to do data:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`);
        const blogData = res.data;
        setBlog(blogData);
        
        // Fetch complete things to do data based on the blog's selected thing IDs
        if (blogData.mustVisitThings && blogData.mustVisitThings.length > 0) {
          const thingsData = await fetchThingsToDoData(blogData.mustVisitThings);
          setThingsToDoData(thingsData);
        }
        
        // Fetch properties
        await fetchProperties();
        
        setLoading(false);
        
        // Scroll to top when blog loads
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog');
        setLoading(false);
      }
    };

    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
        setProperties(res.data.filter((property) => property.isActive));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchBlog();
  }, [id]);

  // Helper to safely get background image URL
  const getBackgroundImage = (blog) => {
    if (!blog) return null;
    
    // Handle different possible formats for the backgroundImage
    if (blog.backgroundImage?.data) {
      return blog.backgroundImage.data;
    } else if (typeof blog.backgroundImage === 'string') {
      return blog.backgroundImage;
    }
    
    return null;
  };

  // Helper to safely get blog image URL
  const getBlogImage = (blog) => {
    if (!blog) return null;
    
    // Handle different possible formats for the blogImage
    if (blog.blogImage?.data) {
      return blog.blogImage.data;
    } else if (typeof blog.blogImage === 'string') {
      return blog.blogImage;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
            <p>{error || 'Blog not found'}</p>
            <Link to="/" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const backgroundImage = getBackgroundImage(blog);
  const blogImage = getBlogImage(blog);
  const visibleThings = thingsToDoData.slice(currentIndex, currentIndex + cardsPerView);

  return (
    <div 
      className="pt-20 min-h-screen bg-gradient-to-b from-white to-gray-50/50"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-yellow-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link to="/" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
            <ChevronLeft size={20} className="mr-1" />
            Back to All Destinations
          </Link>
        </motion.div>

        {/* Background Image with Title Overlay */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl overflow-hidden mb-8"
        >
          {backgroundImage ? (
            <img 
              src={backgroundImage} 
              alt={blog.title} 
              className="w-full h-auto aspect-[16/9] object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <Compass className="w-16 h-16 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 font-heading text-left drop-shadow-sm">
              {blog.title}
            </h1>
            <div className="flex items-center text-gray-200 text-sm font-body space-x-4">
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                Travel Destination
              </span>
              <span>
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ""}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 font-heading text-gray-800 text-left">
            About This Destination
          </h2>
          <div className="prose max-w-none mb-6 font-body text-gray-700 text-left">
            {blog.description ? (
              blog.description.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
              ))
            ) : (
              <p>No description available for this destination.</p>
            )}
          </div>
        </motion.div>

        {/* Blog Image and Description */}
        {blogImage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <img 
              src={blogImage} 
              alt={blog.title} 
              className="w-full h-auto object-cover"
            />
            <div className="p-6 md:p-8 text-left">
              <div className="prose max-w-none font-body text-gray-700">
                <p>{blog.blogImageDescription}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Things to Do Section - Horizontal Scrolling */}
        {thingsToDoData && thingsToDoData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-left"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2 font-heading text-gray-800 drop-shadow-sm">
                  Must Visit Places
                </h2>
                <p className="text-gray-600 font-body">
                  Discover the best places to explore during your visit
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
                  disabled={currentIndex + cardsPerView >= thingsToDoData.length}
                  whileHover={currentIndex + cardsPerView < thingsToDoData.length ? { scale: 1.05, backgroundColor: 'rgb(37, 99, 235)' } : {}}
                  whileTap={currentIndex + cardsPerView < thingsToDoData.length ? { scale: 0.95 } : {}}
                  className={`p-2 rounded-full border shadow-sm ${
                    currentIndex + cardsPerView >= thingsToDoData.length 
                      ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                      : 'text-blue-600 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            </div>
            
            {/* Horizontal scrolling cards */}
            <div className="relative overflow-hidden">
              <motion.div 
                ref={scrollContainerRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex space-x-6"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                  transition: "transform 0.5s ease-out"
                }}
              >
                {thingsToDoData.map((thing, index) => (
                  <motion.div 
                    key={thing._id || index} 
                    variants={itemVariants}
                    className="flex-shrink-0 w-full md:w-1/3 px-1"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100/80 flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden">
                          {/* Reflection effect on top */}
                          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/20 to-transparent z-20"></div>
                          
                          {/* Gradient overlay on image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent z-10 opacity-40 transition-opacity duration-300"></div>
                          
                          {/* Image - using direct string path from schema */}
                          <img 
                            src={thing.image} 
                            alt={thing.heading || 'Must visit place'} 
                            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="absolute top-3 left-3 z-30">
                          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full font-body shadow-lg shadow-blue-500/20">
                            Must Visit
                          </span>
                        </div>
                        {thing.cityName && (
                          <div className="absolute top-3 right-3 z-30">
                            <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium px-3 py-1 rounded-full font-body shadow-sm">
                              {thing.cityName}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-grow bg-gradient-to-b from-white to-gray-50/70 text-left">
                        <div className="text-gray-800 text-lg font-bold font-heading mb-3">
                          {thing.heading || 'Unnamed Destination'}
                        </div>
                        <p className="text-gray-600 text-sm font-body mb-4">
                          {thing.description || 'No description available'}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group cursor-pointer">
                            <span>Explore more</span>
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
            
            {/* Mobile pagination indicator */}
            <div className="flex justify-center mt-6 md:hidden">
              <div className="text-sm text-gray-600">
                {currentIndex + 1} of {Math.min(thingsToDoData.length, thingsToDoData.length - cardsPerView + 1)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Properties Section at the bottom */}
        {properties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-heading text-gray-800">
                Places to Stay
              </h2>
              <p className="text-gray-600 font-body">
                Discover premium accommodations for your journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, 3).map((property, index) => (
                <motion.div 
                  key={property._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {property.images && property.images[0] ? (
                      <img 
                        src={typeof property.images[0] === 'string' ? property.images[0] : 
                            (property.images[0].data ? property.images[0].data : null)} 
                        alt={property.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Property';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Compass className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md font-semibold text-sm text-blue-600 z-20">
                      ₹{property.price}/night
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow text-left">
                    <h3 className="text-lg font-bold font-heading text-gray-800 mb-1">
                      {property.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-body mb-4 flex items-center">
                      <MapPin size={14} className="mr-1" /> {property.city}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <Link
                        to={`/property/${property._id}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                      >
                        <span>View Details</span>
                        <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {properties.length > 3 && (
              <div className="mt-8 text-center">
                <Link 
                  to="/properties" 
                  className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  View All Properties
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;