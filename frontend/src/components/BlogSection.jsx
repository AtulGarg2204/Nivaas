import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState(null);
  const sectionRef = useRef(null);

  // Responsive number of blogs to show
  const getVisibleCount = () => {
    if (window.innerWidth >= 1280) return 4; // xl screens
    if (window.innerWidth >= 1024) return 3; // lg screens
    if (window.innerWidth >= 768) return 2; // md screens
    return 1; // sm screens
  };

  const [blogsPerPage, setBlogsPerPage] = useState(getVisibleCount());

  // Update mouse position for gradient following effect
  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  // Update blogs per page on window resize
  useEffect(() => {
    // Set initial count
    setBlogsPerPage(getVisibleCount());

    const handleResize = () => {
      const newCount = getVisibleCount();
      setBlogsPerPage(newCount);
      // Reset current index if needed after resize
      setCurrentIndex(prev => Math.min(prev, Math.max(0, blogs.length - newCount)));
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [blogs.length]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/blogs`
        );
        // Filter only active blogs
        const filteredBlogs = res.data.filter((blog) => 
          blog.isActive === undefined || blog.isActive === true
        );
        setBlogs(filteredBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + blogsPerPage < blogs.length ? prev + 1 : prev
    );
  };
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } }
  };
  
  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };
  
  // Button hover animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-tr from-gray-50 via-blue-50/10 to-purple-50/10 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="h-4 w-full md:w-96 bg-gray-200 rounded-md animate-pulse"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: item * 0.1 }
                }}
                className="flex flex-col"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full w-full">
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-tr from-gray-50 via-blue-50/10 to-purple-50/10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
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

  // Don't display the section if no blogs
  if (blogs.length === 0) {
    return null;
  }

  // Make sure we have at least one blog visible in mobile
  const visibleBlogs = blogs.slice(currentIndex, currentIndex + Math.max(1, blogsPerPage));
  
  return (
    <div 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-16 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 50%),
          linear-gradient(to bottom right, #f9fafb, #f3f4f6, #f1f5f9)
        `
      }}
    >
      {/* Decorative background elements with size constraints */}
      <div className="absolute top-0 right-0 opacity-30 max-w-full">
        <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(59, 130, 246, 0.1)" d="M41.9,-65.7C55.9,-56.3,69.8,-47.1,77.9,-33.8C86,-20.4,88.1,-3,85.1,13.3C82.1,29.6,74,44.8,61.8,55.5C49.6,66.3,33.3,72.6,16.3,76.7C-0.6,80.9,-18.3,82.8,-32.8,76.9C-47.3,71,-58.7,57.2,-67.8,42.2C-76.9,27.2,-83.8,11,-82.9,-4.9C-82,-20.8,-73.3,-36.3,-61.6,-47.8C-49.9,-59.3,-35.2,-66.7,-21.5,-75.7C-7.9,-84.8,4.7,-95.6,17.2,-92.2C29.7,-88.8,41.9,-71.1,41.9,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 opacity-30 max-w-full">
        <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(139, 92, 246, 0.1)" d="M48.2,-75.3C62.4,-67.3,73.9,-53.9,81.6,-38.6C89.4,-23.2,93.3,-5.9,87.9,8.2C82.5,22.3,67.7,33.2,55.1,44.7C42.5,56.3,32.1,68.5,19,72.5C5.9,76.5,-9.8,72.2,-24.4,66.4C-39,60.6,-52.4,53.2,-61.8,41.8C-71.1,30.5,-76.2,15.2,-75.7,0.3C-75.2,-14.7,-69,-29.3,-60.6,-42.8C-52.2,-56.2,-41.6,-68.4,-28.6,-76.9C-15.6,-85.5,-0.3,-90.4,14.4,-88.2C29.1,-85.9,43.3,-76.6,48.2,-75.3Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-left mb-6 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 font-heading text-gray-800 drop-shadow-sm text-left">
              Wanderlust Chronicles
            </h2>
            <p className="text-gray-600 font-body text-left">
              Discover breathtaking destinations through our curated travel stories
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="flex space-x-3"
          >
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full shadow-md flex items-center justify-center ${
                currentIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              onClick={handleNext}
              disabled={currentIndex + blogsPerPage >= blogs.length}
              className={`p-2 rounded-full shadow-md flex items-center justify-center ${
                currentIndex + blogsPerPage >= blogs.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              }`}
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleBlogs.map((blog, index) => (
              <motion.div
                key={blog._id || index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onHoverStart={() => setHoverIndex(index)}
                onHoverEnd={() => setHoverIndex(null)}
                layoutId={`blog-${blog._id || index}`}
                className="flex flex-col w-full"
              >
                <Link
                  to={`/blog/${blog._id}`}
                  className="group h-full block w-full"
                >
                  <div 
                    className="bg-white rounded-xl overflow-hidden shadow-lg h-full transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] w-full"
                    style={{
                      background: hoverIndex === index 
                        ? "linear-gradient(to bottom right, white, #f8fafc, #eff6ff)" 
                        : "white"
                    }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      
                      {blog.backgroundImage?.data ? (
                        <img
                          src={blog.backgroundImage.data}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Compass className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                      
                      {/* Shine effect on hover */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                        style={{ 
                          transform: "translateX(-100%)",
                          animation: hoverIndex === index ? "shine 1.5s ease-in-out" : "none"
                        }}
                      ></div>
                      
                      {blog.mustVisitThings && blog.mustVisitThings.length > 0 && (
                        <div className="absolute top-3 right-3 z-20">
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <Sparkles size={12} />
                              {blog.mustVisitThings.length} Must See
                            </span>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-grow flex flex-col text-left">
                      <div className="text-xs text-gray-500 font-body mb-2">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) : ""}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 font-heading text-left">
                        {blog.title}
                      </h3>
                      {blog.description && (
                        <p className="text-gray-600 text-sm font-body mb-4 line-clamp-2 text-left">
                          {blog.description}
                        </p>
                      )}
                      <div className="mt-auto">
                        <div className="inline-flex items-center text-blue-600 text-sm font-medium transition-all duration-300 group-hover:pl-2">
                          <span className="mr-1">Discover Journey</span>
                          <motion.div
                            animate={{ x: hoverIndex === index ? 5 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        {/* Mobile pagination indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="text-sm text-gray-600">
            {currentIndex + 1} of {Math.min(blogs.length, blogs.length - blogsPerPage + 1)}
          </div>
        </div>
      </div>
      
      {/* Add this keyframe animation for shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(20deg);
          }
          100% {
            transform: translateX(100%) rotate(20deg);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogSection;