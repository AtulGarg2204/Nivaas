import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './City-Properties.css'; // Import custom CSS for animations
import Footer from '../components/Footer';

const CityProperties = () => {
  const { id: cityId } = useParams();
  const [city, setCity] = useState(null);
  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [isMobile, setIsMobile] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    guests: '',
    minBeds: '',
    maxBeds: '',
    minPrice: '',
    maxPrice: '',
    bhkType: ''
  });
  
  // Mobile filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Price range for slider
  const [priceRange, setPriceRange] = useState([5000, 200000]);
  
  // Active BHK filter
  const [activeBhk, setActiveBhk] = useState(null);

  // Handle viewport height calculation similar to HomePage
  const handleResize = () => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    
    // Update viewport height
    if (isMobileView) {
      // For mobile, take only 50% of viewport height
      setViewportHeight('50vh');
    } else {
      // For desktop, use exact viewport height to ensure banner fills screen
      setViewportHeight('50vh');
    }
  };

  useEffect(() => {
    // Set initial state based on window size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch city details
        const cityResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities/${cityId}`);
        setCity(cityResponse.data);
        
        // Fetch all properties
        const propertiesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
        
        // Filter properties by cityId
        const cityProperties = propertiesResponse.data.filter(
          property => property.cityId === cityId && (property.isActive === undefined || property.isActive === true)
        );
        
        setProperties(cityProperties);
        
        // Fetch blogs
        const blogsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/active`);
        
        // Filter blogs by city (either cityId or cityName)
        const cityBlogs = blogsResponse.data.filter(blog => 
          (blog.city && (blog.city.cityId === cityId || 
                         blog.city.cityName === cityResponse.data.name))
        );
        
        setBlogs(cityBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Failed to load properties');
        setLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  // Prevent body scrolling when filter modal is open
  useEffect(() => {
    if (showFilterModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showFilterModal]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    if (name === "minPrice") {
      setPriceRange([parseInt(value), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], parseInt(value)]);
    }
    
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleBhkFilter = (bhk) => {
    if (activeBhk === bhk) {
      setActiveBhk(null);
      setFilters({
        ...filters,
        bhkType: ''
      });
    } else {
      setActiveBhk(bhk);
      setFilters({
        ...filters,
        bhkType: bhk
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      guests: '',
      minBeds: '',
      maxBeds: '',
      minPrice: '',
      maxPrice: '',
      bhkType: ''
    });
    setPriceRange([5000, 200000]);
    setActiveBhk(null);
  };

  const applyFilters = () => {
    return properties.filter(property => {
      // Apply guests filter
      if (filters.guests && property.guests < parseInt(filters.guests)) {
        return false;
      }
      
      // Apply beds filter
      if (filters.minBeds && property.beds < parseInt(filters.minBeds)) {
        return false;
      }
      
      if (filters.maxBeds && property.beds > parseInt(filters.maxBeds)) {
        return false;
      }
      
      // Apply price filters with the new price range logic
      // Check if property's price range overlaps with filter's price range
      if (filters.minPrice && property.priceMax < parseFloat(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && property.priceMin > parseFloat(filters.maxPrice)) {
        return false;
      }
      
      // Apply BHK filter if active
      if (filters.bhkType && `${filters.bhkType} BHK` !== property.bhkType) {
        return false;
      }
      
      return true;
    });
  };

  const applyMobileFilters = () => {
    setShowFilterModal(false);
  };

  const filteredProperties = applyFilters();

  // Filters component to be used in both desktop and mobile views
  const FiltersContent = () => (
    <>
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium font-subheading mb-3">Price Per Night</h3>
        <div className="mb-2 flex justify-between">
          <span className="font-body text-sm">₹{priceRange[0].toLocaleString()}</span>
          <span className="font-body text-sm">₹{priceRange[1].toLocaleString()}</span>
        </div>
        <div className="bg-gray-200 h-2 rounded-full mb-4 relative">
          <div 
            className="absolute h-full bg-[rgba(14,63,68,0.95)] rounded-full" 
            style={{
              left: `${((filters.minPrice || priceRange[0]) - 5000) / (200000 - 5000) * 100}%`,
              right: `${100 - ((filters.maxPrice || priceRange[1]) - 5000) / (200000 - 5000) * 100}%`
            }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || priceRange[0]}
            onChange={handlePriceRangeChange}
            min="5000"
            max={priceRange[1]}
            step="1000"
            className="w-full p-2 border border-gray-300 rounded-md font-body text-sm"
            placeholder="Min Price"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || priceRange[1]}
            onChange={handlePriceRangeChange}
            min={priceRange[0]}
            max="200000"
            step="1000"
            className="w-full p-2 border border-gray-300 rounded-md font-body text-sm"
            placeholder="Max Price"
          />
        </div>
      </div>

      {/* Bedrooms Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium font-subheading mb-3">Bedrooms</h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bhk) => (
            <button
              key={bhk}
              onClick={() => handleBhkFilter(bhk)}
              className={`py-1 px-2 border text-xs font-body rounded-md ${
                activeBhk === bhk
                  ? 'bg-[rgba(14,63,68,0.95)] text-white border-[rgba(14,63,68,0.95)]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[rgba(14,63,68,0.95)]'
              }`}
            >
              {bhk} BHK
            </button>
          ))}
        </div>
      </div>

      {/* Guest Count Filter */}
      <div className="mb-6">
        <h3 className="text-md font-medium font-subheading mb-3">Guests</h3>
        <select
          name="guests"
          value={filters.guests}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-300 rounded-md font-body"
        >
          <option value="">Any</option>
          <option value="2">2+</option>
          <option value="4">4+</option>
          <option value="6">6+</option>
          <option value="8">8+</option>
          <option value="10">10+</option>
          <option value="15">15+</option>
          <option value="20">20+</option>
        </select>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgba(14,63,68,0.95)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium font-subheading mb-4">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-[rgba(14,63,68,0.95)] text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium font-subheading mb-4">City Not Found</h2>
          <p>The city you are looking for does not exist.</p>
          <Link to="/" className="mt-4 inline-block bg-[rgba(14,63,68,0.95)] text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Full Viewport Height */}
      <div 
        className="relative overflow-hidden"
        style={{ height: viewportHeight }}
      >
        {city.image ? (
          <img 
            src={city.image} 
            alt={city.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div> {/* Slightly darker overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase tracking-wide mb-4">{city.name}</h1>
            <div className="bg-[rgba(14,63,68,0.95)] text-white text-sm font-medium px-4 py-1 rounded-full font-body inline-block">
              Discover amazing places in {city.name}
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper mobile padding */}
      <div className="bg-gray-50">
        {/* Content div with mobile padding */}
        <div className={isMobile ? 'px-4' : 'container mx-auto px-6 md:px-8 lg:px-12'}>
          <div className="py-8">
            {/* Main content with filters and property list */}
            {properties.length === 0 ? (
              // Full width "No properties found" when there are no properties
              <div className="bg-white rounded-lg p-8 shadow-md text-center">
                <h3 className="text-xl font-medium font-subheading mb-3">No Properties Found</h3>
                <p className="text-gray-600 font-body mb-4">
                  There are currently no properties available in this location.
                </p>
                <Link to="/" className="inline-block bg-[rgba(14,63,68,0.95)] text-white py-2 px-4 rounded-md font-body">
                  Explore Other Locations
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 relative" style={{ minHeight: "800px" }}>
                {/* Mobile Filter Button (fixed at bottom) */}
                <div className="fixed bottom-4 left-0 right-0 z-30 flex justify-center lg:hidden">
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className="bg-[#212121] text-white px-6 py-3 rounded-full shadow-lg font-body flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Filter
                  </button>
                </div>

                {/* Mobile Filter Modal */}
                {showFilterModal && (
                  <div className="fixed inset-0 z-50 flex items-end lg:hidden">
                    {/* Backdrop */}
                    <div 
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                      onClick={() => setShowFilterModal(false)}
                    ></div>
                    
                    {/* Modal Panel */}
                    <div className="relative w-full bg-white rounded-t-xl p-6 z-10 transform transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                      {/* Handle */}
                      <div className="absolute top-2 left-0 right-0 flex justify-center">
                        <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
                      </div>
                      
                      <div className="pt-5">
                        {/* Mobile Filter Header */}
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-medium font-subheading">Filter & Sort</h2>
                          <button 
                            onClick={() => setShowFilterModal(false)}
                            className="text-gray-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Mobile Filter Content */}
                        <div className="mb-4">
                          <FiltersContent />
                        </div>
                        
                        {/* Mobile Filter Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button 
                            onClick={clearAllFilters}
                            className="flex-1 py-3 border border-gray-300 rounded-md font-body text-gray-700"
                          >
                            Clear All
                          </button>
                          <button 
                            onClick={applyMobileFilters}
                            className="flex-1 py-3 bg-[rgba(14,63,68,0.95)] text-white rounded-md font-body"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="lg:w-1/4 hidden lg:block">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                        </svg>
                        <h2 className="text-lg font-medium font-subheading">Filters</h2>
                      </div>
                      <button 
                        onClick={clearAllFilters}
                        className="text-sm text-[#a0936a] hover:text-[rgba(14,63,68,0.95)] font-body"
                      >
                        Clear All
                      </button>
                    </div>

                    <FiltersContent />
                  </div>
                </div>
                
                {/* Main Content - Right Side (Scrollable) */}
                <div className="lg:w-3/4 lg:overflow-y-auto">
                  {/* Properties List Section */}
                  {filteredProperties.length > 0 ? (
                    <div className="mb-12">
                      <h2 className="text-2xl font-heading uppercase tracking-wide text-left text-gray-800 mb-6 pl-4">Properties in {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 px-4">
                        {filteredProperties.map((property) => (
                          <Link 
                            to={`/property/${property._id}`} 
                            key={property._id} 
                            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-sm mx-auto w-full"
                          >
                            <div className="p-0">
                              {/* Property Image */}
                              <div className="aspect-[4/3] w-full relative">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    src={property.images[0].data}
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                )}
                                
                            
                              </div>
                              
                              {/* Property Details below image */}
                              <div className="p-4">
                                <div className="mb-2">
                                  <h3 className="text-lg text-left font-medium font-subheading text-gray-800">{property.name}</h3>
                                  <div className="text-gray-600 text-left text-sm font-body">
                                    {property.subplace && `${property.subplace}, `}{city.name}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 mb-2">
                                  <div className="flex items-center text-xs text-gray-600 font-body">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    {property.guests} guests
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600 font-body">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    {property.rooms} rooms
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600 font-body">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"></path>
                                    </svg>
                                    {property.beds} beds
                                  </div>
                                  <div className="flex items-center text-xs text-gray-600 font-body">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                    {property.baths} baths
                                  </div>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                  <p className="text-xs text-gray-500 line-clamp-1 font-body max-w-[70%]">
                                    {property.description ? (property.description.substring(0, 80) + (property.description.length > 80 ? '...' : '')) : "Experience a wonderful stay..."}
                                  </p>
                                  
                                  <div className="flex items-center text-[#a0936a]">
                                    <span className="text-xs font-medium font-body">View Details</span>
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 shadow-md text-center mb-12">
                      <h3 className="text-xl font-medium font-subheading mb-3">No Properties Found</h3>
                      <p className="text-gray-600 font-body mb-4">
                        No properties match your current filters. Please try adjusting your search criteria.
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="inline-block bg-[rgba(14,63,68,0.95)] text-white py-2 px-4 rounded-md font-body"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                  
                  {/* The Unexplored Section with Blogs - Now adjusted to match property cards */}
                  {blogs.length > 0 && (
                    <div className="px-4">
                      <h2 className="text-2xl font-heading uppercase tracking-wide text-left text-gray-800 mb-6">The Unexplored {city.name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {blogs.map((blog) => (
                          <Link 
                            to={`/blog/${blog._id}`} 
                            key={blog._id} 
                            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-sm mx-auto w-full"
                          >
                            {/* Blog Background Image */}
                            <div className="aspect-[4/3] w-full relative overflow-hidden">
                              {blog.backgroundImage?.data ? (
                                <img 
                                  src={blog.backgroundImage.data} 
                                  alt={blog.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                  </svg>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                            </div>
                            {/* Blog Content */}
                            <div className="p-4">
                              <h3 className="text-lg font-medium font-subheading mb-2 text-gray-800">{blog.title}</h3>
                              <p className="text-gray-600 text-sm font-body line-clamp-2 mb-3">{blog.description}</p>
                              
                              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-xs text-gray-500 font-body">
                                  {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                                
                                <div className="flex items-center text-[#a0936a]">
                                  <span className="text-xs font-medium font-body">Read More</span>
                                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer without additional margins */}
        <Footer/>
      </div>
    </div>
  );
};

export default CityProperties;
