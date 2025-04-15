
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import logo from '../assets/logo_nivaas.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cities, setCities] = useState([]);
  const [cityProperties, setCityProperties] = useState({});
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const staysRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const propertyDropdownRef = useRef(null);
  
  // Check if we're on a page that should have transparent navbar initially
  const isCityPage = location.pathname.startsWith('/city/');
  const isHomePage = location.pathname === '/';
  const isBlogDetailPage = location.pathname.startsWith('/blog/');
  const hasTransparentHeader = isHomePage || isCityPage;
  const getNavbarStyle = () => {
    // Check if we're at the top of the page and on a page that should have transparent navbar
    const shouldBeTransparent = !scrolled && 
                               hasTransparentHeader && 
                               !isOpen && 
                               !showCityDropdown;
    
    return {
      backgroundColor: shouldBeTransparent ? 'transparent' : 'white',
      boxShadow: shouldBeTransparent ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.15)',
      backdropFilter: shouldBeTransparent ? 'none' : 'blur(8px)'
    };
  };
  // Fetch cities and properties
  useEffect(() => {
    const fetchCitiesAndProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch cities first
        const citiesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
        const activeCities = citiesRes.data.filter(city => city.isActive && city.showOnHome);
        setCities(activeCities);
        
        // Fetch all properties
        const propertiesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
        
        // Organize properties by city
        const propertiesByCity = {};
        activeCities.forEach(city => {
          const cityProperties = propertiesRes.data.filter(
            property => property.cityId === city._id && 
                       (property.isActive === undefined || property.isActive === true)
          );
          propertiesByCity[city._id] = cityProperties;
        });
        
        setCityProperties(propertiesByCity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCitiesAndProperties();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current && 
        !cityDropdownRef.current.contains(event.target) &&
        staysRef.current &&
        !staysRef.current.contains(event.target) &&
        (!propertyDropdownRef.current || !propertyDropdownRef.current.contains(event.target))
      ) {
        setShowCityDropdown(false);
        setHoveredCity(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 // Track scrolling to change navbar background
useEffect(() => {
  const handleScroll = () => {
    // Calculate scroll percentage (max threshold at 100px)
    const scrollPosition = window.scrollY;
    const scrollPercentage = Math.min(scrollPosition / 100, 1);
    setScrollProgress(scrollPercentage);
    
    // Only set scrolled to true if we've scrolled more than 50px
    if (scrollPosition > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  
  // Initial check when component mounts
  handleScroll();
  
  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

  // Scroll to blogs section
  const scrollToBlogs = () => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const blogsSection = document.getElementById('blogs-section') || 
                             document.querySelector('.py-16.bg-gradient-to-b');
        if (blogsSection) {
          blogsSection.scrollIntoView({ behavior: 'smooth' });
        } 
      }, 300); // Increased timeout to ensure the page loads
    } else {
      // Try to find the blogs section by multiple selectors
      const blogsSection = document.getElementById('blogs-section') || 
                           document.querySelector('.py-16.bg-gradient-to-b');
      if (blogsSection) {
        blogsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Get text color based on scroll state and transparency
  const getTextColor = () => {
    if (scrolled || isOpen || !hasTransparentHeader || showCityDropdown) {
      return 'text-[#ad8b3a]'; // Brand color when navbar has background
    } else {
      return 'text-white'; // White when navbar is transparent
    }
  };

  // // Dynamic styles
  // const navbarStyle = {
  //   backgroundColor: scrolled || isOpen || !hasTransparentHeader || showCityDropdown
  //     ? 'white' 
  //     : 'transparent',
  //   boxShadow: scrolled || showCityDropdown ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
  //   backdropFilter: scrolled || showCityDropdown ? 'blur(8px)' : 'none',
  // };

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

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  // Toggle mobile dropdown for stays section
  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  return (
    <nav 
      className="w-full fixed top-0 z-[1000] transition-all duration-300"
      style={getNavbarStyle()}
    >
      {/* Highlight line at the bottom of navbar when scrolled */}
      {(scrolled || showCityDropdown) && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white via-white to-white"></div>
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
          {/* Stays dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => setShowCityDropdown(true)}
            onMouseLeave={() => {
              if (!hoveredCity) {
                setShowCityDropdown(false);
              }
            }}
            ref={staysRef}
          >
            <motion.div
              variants={linkVariants}
              initial="initial"
              whileHover="hover"
              className="cursor-pointer"
            >
              <div className={`${getTextColor()} text-base font-body relative group flex items-center`}>
                STAYS
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transition-transform duration-300 ${showCityDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] ${getTextColor().replace('text-', 'bg-')} group-hover:w-full transition-all duration-300`}></span>
              </div>
            </motion.div>
            
            {/* City Dropdown */}
            <AnimatePresence>
              {showCityDropdown && (
                <motion.div 
                  className="fixed left-0 right-0 mt-2 bg-white rounded-b-lg shadow-xl z-50"
                  style={{ 
                    top: "70px", // Adjust based on your navbar height
                    minHeight: "225px" // Set max height to 225px as requested
                  }}
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  ref={cityDropdownRef}
                >
                  <div className="container mx-auto px-8 md:px-16 lg:px-24 pt-3"> {/* Added padding top */}
                    {/* Removed Popular Destinations heading and line break */}
                    
                    {loading ? (
                      <div className="px-4 py-2 text-gray-600">Loading...</div>
                    ) : cities.length > 0 ? (
                      <div className="grid grid-cols-4 gap-8 h-[180px]"> {/* Adjusted height container to fit within 225px max height */}
                        {/* First column - City list with vertical scrolling if needed */}
                        <div className="col-span-1 border-r border-gray-200 pr-4 overflow-y-auto h-full">
                          {cities.map(city => (
                            <Link 
                              key={city._id}
                              to={`/city/${city._id}`}
                              className={`block py-1.5 px-4 rounded-md transition-colors text-left ${
                                hoveredCity === city._id ? 'bg-gray-100' : 'hover:bg-gray-50'
                              }`}
                              onMouseEnter={() => setHoveredCity(city._id)}
                              onClick={() => {
                                setShowCityDropdown(false);
                                setHoveredCity(null);
                              }}
                            >
                              <span className="font-medium text-[#13130F]">{city.name}</span>
                            </Link>
                          ))}
                        </div>
                        
                        {/* Properties with horizontal scrolling */}
                        <div className="col-span-3 overflow-hidden">
                          {hoveredCity && cityProperties[hoveredCity]?.length > 0 ? (
                            <div className="overflow-x-auto pb-2 h-full"> {/* Reduced bottom padding */}
                              <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
                                {cityProperties[hoveredCity].map(property => (
                                  <Link 
                                    key={property._id}
                                    to={`/property/${property._id}`}
                                    className="block hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                                    onClick={() => {
                                      setShowCityDropdown(false);
                                      setHoveredCity(null);
                                    }}
                                    style={{ width: "180px" }} // Fixed width for each property card
                                  >
                                    <div className="w-[180px] h-[120px] rounded-lg overflow-hidden mb-1"> {/* Reduced margin bottom */}
                                      {property.images && property.images.length > 0 ? (
                                        <img 
                                          src={property.images[0].data} 
                                          alt={property.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="px-2 pb-1"> {/* Reduced padding bottom */}
                                      <div className="font-medium text-[#13130F] truncate">{property.name}</div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : !hoveredCity ? (
                            <div className="overflow-x-auto pb-2 h-full"> {/* Reduced bottom padding */}
                              <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
                                {/* Show featured properties when no city is hovered */}
                                {Object.values(cityProperties)
                                  .flat()
                                  .slice(0, 8)
                                  .map(property => (
                                    <Link 
                                      key={property._id}
                                      to={`/property/${property._id}`}
                                      className="block hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
                                      onClick={() => {
                                        setShowCityDropdown(false);
                                      }}
                                      style={{ width: "180px" }} // Fixed width for each property card
                                    >
                                      <div className="w-[180px] h-[120px] rounded-lg overflow-hidden mb-1"> {/* Reduced margin bottom */}
                                        {property.images && property.images.length > 0 ? (
                                          <img 
                                            src={property.images[0].data} 
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="px-2 pb-1"> {/* Reduced padding bottom */}
                                        <div className="font-medium text-[#13130F] truncate">{property.name}</div>
                                        <div className="text-sm text-gray-600 truncate">{
                                          cities.find(city => city._id === property.cityId)?.name
                                        }</div>
                                      </div>
                                    </Link>
                                  ))
                                }
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No properties available for this destination
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-600">No destinations available</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Blogs - changed from About Us */}
          <motion.div
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
          >
            <button 
              onClick={scrollToBlogs}
              className={`${getTextColor()} text-base font-body relative group`}
            >
              BLOGS
              <span className={`absolute bottom-0 left-0 w-0 h-[2px] ${getTextColor().replace('text-', 'bg-')} group-hover:w-full transition-all duration-300`}></span>
            </button>
          </motion.div>
          
          <motion.div
            variants={linkVariants}
            initial="initial"
            whileHover="hover"
            className="flex items-center text-white text-base font-body bg-[#ad8b3a] px-4 py-2 rounded-[16px] transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+917969469950" className="hover:text-white transition-colors duration-300">
              CALL US - +91 7969469950
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
            className={`focus:outline-none transition-all duration-300 ${
              scrolled ? 'text-[#ad8b3a]' : 'text-white'
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
        
        {/* Mobile Menu - Vertical and Left Aligned with nested dropdowns */}
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
            <div className="container mx-auto px-6 py-5 flex flex-col text-left space-y-6">
              {/* Mobile Stays Dropdown */}
              <div className="space-y-1">
                <div 
                  className="flex justify-between items-center text-white text-base font-medium font-body cursor-pointer"
                  onClick={toggleMobileDropdown}
                >
                  <span>STAYS</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ml-1 transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Mobile Cities Dropdown */}
                <AnimatePresence>
                  {mobileDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3">
                        {loading ? (
                          <div className="text-gray-300 text-sm ml-6">Loading...</div>
                        ) : cities.length > 0 ? (
                          cities.map(city => (
                            <div key={city._id} className="mb-4">
                              <Link 
                                to={`/city/${city._id}`}
                                className="block text-white text-sm font-medium font-body py-1 text-left ml-6"
                                onClick={() => {
                                  setIsOpen(false);
                                  setMobileDropdownOpen(false);
                                }}
                              >
                                {city.name}
                              </Link>
                              
                              {/* Show top 3 properties for each city on mobile */}
                              {cityProperties[city._id]?.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {cityProperties[city._id].slice(0, 3).map(property => (
                                    <Link
                                      key={property._id}
                                      to={`/property/${property._id}`}
                                      className="block text-gray-300 text-xs font-body py-1 text-left ml-12"
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileDropdownOpen(false);
                                      }}
                                    >
                                      {property.name}
                                    </Link>
                                  ))}
                                  {cityProperties[city._id].length > 3 && (
                                    <Link
                                      to={`/city/${city._id}`}
                                      className="block text-cyan-300 text-xs font-body py-1 italic text-left ml-12"
                                      onClick={() => {
                                        setIsOpen(false);
                                        setMobileDropdownOpen(false);
                                      }}
                                    >
                                      + {cityProperties[city._id].length - 3} more...
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-300 text-sm ml-6">No cities available</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Blogs Link - changed from About Us */}
              <button
                onClick={() => {
                  scrollToBlogs();
                  setIsOpen(false);
                }}
                className="text-white text-base font-medium font-body text-left"
              >
                BLOGS
              </button>
              
              
              <a 
                href="tel:+917969469950" 
                className="flex items-center text-white text-base font-body"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                CALL US - +91 7969469950
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;