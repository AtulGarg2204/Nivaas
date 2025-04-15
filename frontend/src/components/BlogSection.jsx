import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight,Compass } from "lucide-react";
import { motion } from "framer-motion";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);

  // Responsive number of blogs to show
  const getVisibleCount = () => {
    if (window.innerWidth >= 1280) return 4; // xl screens
    if (window.innerWidth >= 1024) return 3; // lg screens
    if (window.innerWidth >= 768) return 2; // md screens
    return 1; // sm screens
  };

  const [blogsPerPage, setBlogsPerPage] = useState(getVisibleCount());

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
      <div id="blogs-section" className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-start mb-10 px-4">
            <div className="max-w-lg text-left">
              <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col">
                <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 h-full">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="p-5 space-y-3">
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
      <div id="blogs-section" className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left text-red-500 font-body p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm px-4">
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
      id="blogs-section"
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-gray-50/80 to-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-96 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-full h-96 bg-gradient-to-tr from-yellow-500/5 to-red-500/5 rounded-full blur-3xl transform -translate-x-1/2"></div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg text-left"
          >
            <div className="flex items-center justify-between">
              {/* Main heading in Cinzel, all uppercase */}
              <h2 className="text-3xl md:text-4xl font-heading text-[#13130F] uppercase tracking-wide drop-shadow-sm">
                BLOGS
              </h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex space-x-3 ml-4 md:hidden"
              >
                <motion.button 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  whileHover={currentIndex !== 0 ? { scale: 1.05, backgroundColor: '#ad8b3a' } : {}}
                  whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
                  className={`p-2 rounded-full border shadow-sm ${
                    currentIndex === 0 
                      ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                      : 'text-[#ad8b3a] border-[rgba(14,63,68,0.3)] hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button 
                  onClick={handleNext}
                  disabled={currentIndex + blogsPerPage >= blogs.length}
                  whileHover={currentIndex + blogsPerPage < blogs.length ? { scale: 1.05, backgroundColor: '#ad8b3a' } : {}}
                  whileTap={currentIndex + blogsPerPage < blogs.length ? { scale: 0.95 } : {}}
                  className={`p-2 rounded-full border shadow-sm ${
                    currentIndex + blogsPerPage >= blogs.length 
                      ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                      : 'text-[#ad8b3a] border-[rgba(14,63,68,0.3)] hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>
            </div>
            <p className="text-gray-600 font-body pl-0.5 mt-2">
              Discover breathtaking destinations through our curated travel stories and luxury experiences.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex space-x-3 self-center md:self-start md:mt-3"
          >
            <motion.button 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              whileHover={currentIndex !== 0 ? { scale: 1.05, backgroundColor: '#ad8b3a' } : {}}
              whileTap={currentIndex !== 0 ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full border shadow-sm ${
                currentIndex === 0 
                  ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                  : 'text-[#ad8b3a] border-[rgba(14,63,68,0.3)] hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
              }`}
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button 
              onClick={handleNext}
              disabled={currentIndex + blogsPerPage >= blogs.length}
              whileHover={currentIndex + blogsPerPage < blogs.length ? { scale: 1.05, backgroundColor: '#ad8b3a' } : {}}
              whileTap={currentIndex + blogsPerPage < blogs.length ? { scale: 0.95 } : {}}
              className={`p-2 rounded-full border shadow-sm ${
                currentIndex + blogsPerPage >= blogs.length 
                  ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                  : 'text-[#ad8b3a] border-[rgba(14,63,68,0.3)] hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4"
        >
          {visibleBlogs.map((blog, index) => (
            <motion.div 
              key={blog._id || index} 
              variants={itemVariants}
              className="flex flex-col"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
      
<Link to={`/blog/${blog._id}`}>
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col h-full transition-all duration-300">
    <div className="relative">
      <div className="aspect-[4/3] overflow-hidden">
        {/* Reflection effect on top */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/20 to-transparent z-20"></div>
        
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent z-10 opacity-40 group-hover:opacity-0 transition-opacity duration-300"></div>
        
        {blog.backgroundImage?.data ? (
          <img 
            src={blog.backgroundImage.data} 
            alt={blog.title} 
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Compass className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>
    
    </div>
    
    <div className="p-5 flex-grow bg-gradient-to-b from-white to-gray-50/70 text-left flex flex-col">
      {/* Changed to font-subheading (Inter) with font-medium (500) */}
      <div className="text-[#13130F] text-lg font-medium font-subheading mb-2">
        {blog.title || 'Unnamed Blog'}
      </div>
      
      {/* Fixed height for description with single line only */}
      <div className="h-6 overflow-hidden text-gray-600 text-sm font-body mb-4">
        {blog.description || 'No description available'}
      </div>
      
      <div className="mt-auto">
        <div className="inline-flex items-center text-sm font-medium text-[#ad8b3a] hover:text-black transition-colors group cursor-pointer">
          <span>Read more</span>
          <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogSection;