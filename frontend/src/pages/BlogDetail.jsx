import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import { ChevronLeft, ChevronRight, Compass, MapPin } from 'lucide-react';
import Footer from '../components/Footer';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [thingsToDoData, setThingsToDoData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollContainerRef = useRef(null);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [guests, setGuests] = useState('');
  const [children, setChildren] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Custom theme colors - matching property detail
  const primaryBtnBg = "#ad8b3a";
  const primaryBtnText = "white";
  
  // Number of cards to display per view
  const cardsPerView = 4; // Increased to show more cards in view

  // Navigation for things to do cards
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      Math.min(thingsToDoData.length - cardsPerView, prev + 1)
    );
  };

  // Handle check-in date change and ensure check-out date is never before check-in
  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);
    
    // If check-out date is before new check-in date, update it
    if (checkOutDate && checkOutDate < newCheckInDate) {
      setCheckOutDate(newCheckInDate);
    }
  };

  // Form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate || !selectedProperty) {
      setSubmitMessage("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    setSubmitMessage("");
    
    try {
      // Find the selected property details
      const property = properties.find(p => p._id === selectedProperty) || {};
      const propertyName = property.name || "Selected Property";
      const propertyCity = property.city || "";
      
      // Create the WhatsApp message with form data
      const whatsappMessage = encodeURIComponent(
        `Hey Team Nivaas! ✨\n` +
        `I'd like to check availability for the following stay:\n` +
        `Property Name: ${propertyName}\n` +
        `Location: ${propertyCity}\n` +
        `Check-in: ${checkInDate}\n` +
        `Check-out: ${checkOutDate}\n` +
        `Number of guests: ${guests} adults, ${children} children\n` +
        `Please let me know the availability and booking details`
      );
      
      // Set success message
      setSubmitMessage("Your booking request has been submitted. Redirecting to WhatsApp...");
      
      // After a short delay, redirect to WhatsApp
      setTimeout(() => {
        window.open(`https://wa.me/918168650582?text=${whatsappMessage}`, '_blank');
        
        // Reset form
        setCheckInDate("");
        setCheckOutDate("");
        setGuests(1);
        setChildren(0);
        setFirstName("");
        setLastName("");
        setSelectedProperty("");
        setSubmitMessage("Your booking request has been submitted!");
      }, 1500);
      
    } catch (error) {
      setSubmitMessage("There was an error submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
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

  // Function to safely render HTML content
  const createMarkup = (html) => {
    return { __html: html || '' };
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ad8b3a]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium font-heading mb-4">Error</h2>
          <p>{error || "Blog not found"}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-[#ad8b3a] text-white py-2 px-4 rounded-md font-body"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const backgroundImage = getBackgroundImage(blog);
  const blogImage = getBlogImage(blog);
  
  return (
    <div className="pt-28 min-h-screen bg-white"> {/* Added pt-28 to create space from navbar */}
    {/* Container with left/right spacing for hero image */}
    <div className="container mx-auto px-8 md:px-16 lg:px-24">
      <div className="relative w-full rounded-lg overflow-hidden" style={{ height: "500px" }}>
        {backgroundImage ? (
          <img 
            src={backgroundImage} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
            <Compass className="w-16 h-16 text-white" />
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 p-8 md:p-16 container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-heading text-white mb-4 drop-shadow-sm">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center text-gray-200 text-sm md:text-base font-body space-x-4">
            {blog.city && blog.city.cityName && (
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {blog.city.cityName}
              </span>
            )}
            {(!blog.city || !blog.city.cityName) && (
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                Travel Destination
              </span>
            )}
            <span>
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ""}
            </span>
          </div>
        </div>
      </div>
    </div>

      {/* Main Content with Left/Right Split */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8 mt-16">
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:w-2/3">
            {/* About this destination */}
            <div className="mb-12">
              <h2 className="text-2xl font-heading uppercase tracking-wide mb-6 text-left">
                About this Destination
              </h2>
              <div className="text-gray-700 font-body text-left leading-relaxed">
                {blog.description ? (
                  blog.description.split('\n').map((paragraph, index) => (
                    paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                  ))
                ) : (
                  <p>No description available for this destination.</p>
                )}
              </div>
            </div>

            {/* CKEditor Rich Text Content Section */}
            {blog.editorContent && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading uppercase tracking-wide mb-6 text-left">
                  Detailed Information
                </h2>
                <div 
                  className="prose prose-lg max-w-none font-body text-gray-700 text-left"
                  dangerouslySetInnerHTML={createMarkup(blog.editorContent)}
                >
                  {/* CKEditor content rendered here */}
                </div>
              </div>
            )}

            {/* Blog Image and Description - Only if blogImage exists */}
            {blogImage && (
              <div className="mb-12">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={blogImage} 
                    alt={blog.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="prose max-w-none font-body text-gray-700">
                    <p>{blog.blogImageDescription}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24 border border-gray-200">
              <h2 className="text-xl font-medium font-subheading mb-8 text-left">
                Get Assistance for Villa Search
              </h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded font-body text-left"
                      style={{ textAlign: "left" }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded font-body text-left"
                      style={{ textAlign: "left" }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Check in"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = e.target.value ? 'date' : 'text'}
                        value={checkInDate}
                        onChange={handleCheckInDateChange}
                        className="w-full p-3 border border-gray-300 rounded font-body text-left"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Check out"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = e.target.value ? 'date' : 'text'}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || undefined}
                        className="w-full p-3 border border-gray-300 rounded font-body text-left"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded font-body text-left"
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map(property => (
                      <option key={property._id} value={property._id}>
                        {property.name} - {property.city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Guest"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded font-body text-left"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Children"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded font-body text-left"
                    />
                  </div>
                </div>
                
                {submitMessage && (
                  <div className={`p-3 rounded font-body text-center ${
                    submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full p-3 rounded font-body ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: primaryBtnBg, color: primaryBtnText }}
                >
                  {submitting ? 'Sending...' : 'Send application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Things to Do Section - Outside the split div */}
      {thingsToDoData && thingsToDoData.length > 0 && (
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8 mb-16">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
            <div className="text-left">
              <h2 className="text-2xl font-heading uppercase tracking-wide mb-2 text-[#13130F]">
                Must Visit Places
              </h2>
              <p className="text-gray-600 font-body">
                Discover the best places to explore during your visit
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full border shadow-sm ${
                  currentIndex === 0 
                    ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                    : 'text-[#ad8b3a] border-amber-300 hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
                }`}
                aria-label="Previous"
              >
            
              </button>
              <button 
                onClick={handleNext}
                disabled={currentIndex + cardsPerView >= thingsToDoData.length}
                className={`p-2 rounded-full border shadow-sm ${
                  currentIndex + cardsPerView >= thingsToDoData.length 
                    ? 'text-gray-300 border-gray-300 cursor-not-allowed' 
                    : 'text-[#ad8b3a] border-amber-300 hover:bg-[#ad8b3a] hover:text-white hover:border-[#ad8b3a] transition-all duration-300'
                }`}
                aria-label="Next"
              >
              
              </button>
            </div>
          </div>
          
          {/* Horizontal scrolling cards - matched to property card style */}
          <div className="relative overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex space-x-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                transition: "transform 0.5s ease-out"
              }}
            >
              {thingsToDoData.map((thing, index) => (
                <div 
                  key={thing._id || index} 
                  className="flex-shrink-0 w-full md:w-1/4 px-1"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col h-full transition-transform hover:shadow-lg">
                    <div className="relative">
                      <div className="h-[280px] overflow-hidden">
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent z-5 opacity-40 transition-opacity duration-300"></div>
                        
                        {/* Image */}
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
                      
                      {thing.cityName && (
                        <div className="absolute top-3 right-3 z-20">
                          <span className="bg-white/90 backdrop-blur-sm text-[#ad8b3a] text-xs font-medium px-3 py-1 rounded-full font-body shadow-sm">
                            {thing.cityName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-grow text-left">
                      <div className="text-[#13130F] text-lg font-medium font-subheading mb-2">
                        {thing.heading || 'Unnamed Destination'}
                      </div>
                      <p className="text-gray-600 text-sm font-body h-10 overflow-hidden">
                        {thing.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile pagination indicator */}
          <div className="flex justify-center mt-6 md:hidden">
            <div className="text-sm text-gray-600">
              {currentIndex + 1} of {Math.min(thingsToDoData.length, thingsToDoData.length - cardsPerView + 1)}
            </div>
          </div>
        </div>
      )}

      {/* Properties Section */}
      {properties.length > 0 && (
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8 mb-16">
          <div className="text-left mb-8">
            <h2 className="text-2xl font-heading uppercase tracking-wide mb-2 text-[#13130F]">
              Places to Stay
            </h2>
            <p className="text-gray-600 font-body">
              Discover premium accommodations for your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {properties.slice(0, 4).map((property, index) => (
              <div 
                key={property._id}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col h-full hover:shadow-lg transition-all"
              >
                <div className="relative h-[280px] overflow-hidden">
                  {property.images && property.images[0] ? (
                    <img 
                      src={typeof property.images[0] === 'string' ? property.images[0] : 
                          (property.images[0].data ? property.images[0].data : null)} 
                      alt={property.name} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
                </div>
                
                <div className="p-4 flex-grow text-left">
                  <h3 className="text-lg font-medium font-subheading text-[#13130F] mb-1">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-body mb-3 flex items-center">
                    <MapPin size={14} className="mr-1" /> {property.city}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <Link
                      to={`/property/${property._id}`}
                      className="inline-flex items-center text-sm font-medium text-[#ad8b3a] hover:text-amber-800 transition-colors group"
                    >
                      <span>View Details</span>
                      <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
};

export default BlogDetail;