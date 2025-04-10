import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo_nivaas.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  
  // Check if we're on a page that should have transparent navbar initially
  const isCityPage = location.pathname.startsWith('/city/');
  const isHomePage = location.pathname === '/';
  const hasTransparentHeader = isHomePage || isCityPage;

  // Track scrolling to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage (max threshold at 100px)
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.min(scrollPosition / 100, 1);
      setScrollProgress(scrollPercentage);
      
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Interpolate colors based on scroll position
  const interpolateColor = (scrollProgress) => {
    // Initial state: transparent
    // Final state: #0e3f44 with opacity
    return scrolled || isOpen || !hasTransparentHeader
      ? 'rgba(14, 63, 68, 0.95)' // The requested #0e3f44 color with opacity
      : 'transparent';
  };

  // Dynamic styles
  const navbarStyle = {
    backgroundColor: interpolateColor(scrollProgress),
    boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
    backdropFilter: scrolled ? 'blur(8px)' : 'none',
  };

  // Link hover effect variants
  const linkVariants = {
    initial: { 
      y: 0, 
      opacity: 1 
    },
    hover: { 
      y: -2, 
      opacity: 1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut" 
      } 
    }
  };

  // Logo animation variants
  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.3, 
        ease: "easeInOut" 
      } 
    }
  };

  return (
    <nav 
      className="w-full fixed top-0 z-50 transition-all duration-300"
      style={navbarStyle}
    >
      {/* Highlight line at the bottom of navbar when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400"></div>
      )}
      
      {/* Desktop Navigation - hidden on mobile */}
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-5 hidden md:flex justify-between items-center">
        {/* Logo on the left */}
        <motion.div 
          className="flex items-center"
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
        >
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="NIVAAS Logo" 
              className="h-10 mr-3 transition-all duration-300" 
            />
          </Link>
        </motion.div>
        
        {/* Desktop Navigation items */}
        <div className="flex items-center space-x-10">
          <motion.div
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
          >
            <Link to="/stays" className="text-white text-base font-body relative group">
              Stays
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.div>
          
          <motion.div
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
          >
            <Link to="/about" className="text-white text-base font-body relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.div>
          
          <motion.div
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
            className={`flex items-center text-white text-base font-body ${
              scrolled ? 'bg-teal-700/30' : 'bg-black/20'
            } px-4 py-2 rounded-full transition-colors duration-300`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+917969469950" className="hover:text-cyan-300 transition-colors duration-300">
              Call us - +91 7969469950
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header with menu button */}
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
          >
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="NIVAAS Logo" 
                className="h-8 transition-all duration-300" 
              />
            </Link>
          </motion.div>
          
          <motion.button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`text-white focus:outline-none transition-all duration-300 ${
              scrolled ? 'bg-teal-800/40' : 'bg-black/20'
            } p-2 rounded-md`}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
        
        {/* Mobile Menu - Vertical and Left Aligned */}
        <motion.div 
          className="overflow-hidden bg-[#0e3f44]/95 backdrop-blur-md"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {isOpen && (
            <div className="container mx-auto px-6 py-5 flex flex-col text-left space-y-5">
              <Link 
                to="/stays" 
                className="text-white text-base font-body block"
                onClick={() => setIsOpen(false)}
              >
                Stays
              </Link>
              
              <Link 
                to="/about" 
                className="text-white text-base font-body block"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              
              <a 
                href="tel:+917969469950" 
                className="flex items-center text-white text-base font-body"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call us - +91 7969469950
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;