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
  
  // Filter states
  const [filters, setFilters] = useState({
    guests: '',
    minBeds: '',
    maxBeds: '',
    minPrice: '',
    maxPrice: '',
    bhkType: ''
  });
  
  // Price range for slider
  const [priceRange, setPriceRange] = useState([5000, 200000]);
  
  // Active BHK filter
  const [activeBhk, setActiveBhk] = useState(null);

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
      
      // Apply price filters
      if (filters.minPrice && property.price < parseFloat(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
        return false;
      }
      
      // Apply BHK filter if active
      if (filters.bhkType && `${filters.bhkType} BHK` !== property.bhkType) {
        return false;
      }
      
      return true;
    });
  };

  const filteredProperties = applyFilters();

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 font-heading">City Not Found</h2>
          <p>The city you are looking for does not exist.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section with City Image */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        {city.image ? (
          <img 
            src={city.image} 
            alt={city.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800"></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{city.name}</h1>
            <div className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full font-body inline-block">
              {filteredProperties.length} Properties Available
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main content with filters and property list */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Left Side (Fixed) */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  <h2 className="text-lg font-bold font-heading">Filters</h2>
                </div>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-body"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-md font-bold mb-3 font-heading">Price Per Night</h3>
                <div className="mb-2 flex justify-between">
                  <span className="font-body text-sm">₹{priceRange[0].toLocaleString()}</span>
                  <span className="font-body text-sm">₹{priceRange[1].toLocaleString()}</span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full mb-4 relative">
                  <div 
                    className="absolute h-full bg-blue-500 rounded-full" 
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
                <h3 className="text-md font-bold mb-3 font-heading">Bedrooms</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => handleBhkFilter(bhk)}
                      className={`py-1 px-2 border text-xs font-body rounded-md ${
                        activeBhk === bhk
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {bhk} BHK
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count Filter */}
              <div className="mb-6">
                <h3 className="text-md font-bold mb-3 font-heading">Guests</h3>
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
            </div>
          </div>

          {/* Properties List - Right Side (Scrollable) */}
          <div className="lg:w-3/4 lg:overflow-y-auto">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProperties.map((property) => (
                  <Link 
                    to={`/property/${property._id}`} 
                    key={property._id} 
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-0">
                      {/* Property Image */}
                      <div className="aspect-[16/10] w-full relative">
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
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md font-body">
                            ₹{property.price}/night
                          </span>
                        </div>
                      </div>
                      
                      {/* Property Details below image */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 font-heading">{property.name}</h3>
                            <div className="text-gray-600 text-sm font-body">{city.name}, {property.location || "Udaipur"}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-2">
                          <div className="flex items-center text-xs text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            {property.guests} guests
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            {property.rooms} rooms
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"></path>
                            </svg>
                            {property.beds} beds
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
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
                          
                          <div className="flex items-center text-blue-600">
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
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-md text-center">
                <h3 className="text-xl font-bold mb-3 font-heading">No Properties Found</h3>
                <p className="text-gray-600 font-body mb-4">
                  {properties.length === 0 
                    ? "There are currently no properties available in this location." 
                    : "No properties match your current filters. Please try adjusting your search criteria."}
                </p>
                {properties.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* The Unexplored Section with Blogs */}
        {blogs.length > 0 && (
          <div className="mt-20">
            <div className="text-left mb-10">
              <h2 className="text-4xl font-bold font-heading bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                The Unexplored {city.name}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mt-3 rounded-full transform transition-all duration-300 hover:w-32"></div>
              <p className="text-gray-600 mt-4 max-w-2xl font-body">Discover hidden gems and fascinating stories about {city.name} through our curated collection of travel blogs.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <Link 
                  to={`/blog/${blog._id}`} 
                  key={blog._id} 
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Blog Background Image - Using backgroundImage instead of blogImage */}
                  <div className="aspect-[16/10] w-full relative overflow-hidden">
                    {blog.backgroundImage?.data ? (
                      <img 
                        src={blog.backgroundImage.data} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 p-5 text-white">
                      <h3 className="text-xl font-bold mb-2 font-heading transform transition-transform duration-300 group-hover:translate-x-2">{blog.title}</h3>
                    </div>
                  </div>
                  
                  {/* Blog Content */}
                  <div className="p-5">
                    <p className="text-gray-600 text-sm font-body line-clamp-3 text-left mb-4">{blog.description}</p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-body">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      
                      <div className="flex items-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                        <span className="text-xs font-medium font-body">Read More</span>
                        <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        
        {/* Back button */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-body rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Locations
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CityProperties;