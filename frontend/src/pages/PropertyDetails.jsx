import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";


const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [children, setChildren] = useState("0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentModalImage, setCurrentModalImage] = useState(0);

  // Reference for scrolling to reviews section
  const reviewsRef = useRef(null);
  const modalImagesRef = useRef([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/properties/${id}`
        );
        setProperty(res.data);
        setLoading(false);
        // Scroll to top when property loads
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property details");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showAllPhotos || !property) return;
      
      if (e.key === 'ArrowRight') {
        setCurrentModalImage((prev) => 
          prev === property.images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowLeft') {
        setCurrentModalImage((prev) => 
          prev === 0 ? property.images.length - 1 : prev - 1
        );
      } else if (e.key === 'Escape') {
        setShowAllPhotos(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllPhotos, property]);

  // Scroll to selected image in modal
  useEffect(() => {
    if (showAllPhotos && modalImagesRef.current[currentModalImage]) {
      modalImagesRef.current[currentModalImage].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentModalImage, showAllPhotos]);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!property || !property.reviews || property.reviews.length === 0) {
      return 0;
    }
    
    const sum = property.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / property.reviews.length).toFixed(1);
  };

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const openPhotoModal = (initialIndex = 0) => {
    setCurrentModalImage(initialIndex);
    setShowAllPhotos(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate || !name || !email || !phone) {
      setSubmitMessage("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    setSubmitMessage("");
    
    // Here you would normally send the booking request to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage("Your booking request has been submitted. We'll contact you shortly!");
      // Reset form
      setCheckInDate("");
      setCheckOutDate("");
      setGuests("1");
      setChildren("0");
    } catch (error) {
      setSubmitMessage("There was an error submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
          <p>{error || "Property not found"}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get actual average rating
  const averageRating = property.rating?.average || calculateAverageRating();
  const reviewCount = property.reviews?.length || 0;

  return (
    <div className="pt-28 min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 py-3">
          <div className="flex items-center text-sm font-body">
            <Link to="/" className="text-red-600 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">›</span>
            {property.cityId && (
              <>
                <Link to={`/city/${property.cityId}`} className="text-red-600 hover:underline">{property.city || 'City'}</Link>
                <span className="mx-2 text-gray-400">›</span>
              </>
            )}
            <span className="text-gray-500">{property.name}</span>
          </div>
        </div>
      </div>

      {/* Property Gallery Section - UPDATED LAYOUT */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-6">
        <div className="flex flex-col md:flex-row gap-2 h-[500px]">
          {/* Main large image - left side */}
          <div className="w-full md:w-3/5 h-full">
            <div 
              className="relative h-full overflow-hidden rounded-lg cursor-pointer" 
              onClick={() => openPhotoModal(activeImage)}
            >
              {property.images && property.images.length > 0 && (
                <img
                  src={property.images[activeImage]?.data}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Two smaller images stacked - right side */}
          <div className="w-full md:w-2/5 h-full flex flex-col gap-2">
            {/* Top right image */}
            <div className="h-1/2">
              {property.images && property.images.length > 1 && (
                <div 
                  className="relative h-full overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openPhotoModal(1 % property.images.length)}
                >
                  <img
                    src={property.images[1 % property.images.length]?.data}
                    alt={`${property.name} view 2`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Bottom right image */}
            <div className="h-1/2">
              {property.images && property.images.length > 2 && (
                <div 
                  className="relative h-full overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openPhotoModal(2 % property.images.length)}
                >
                  <img
                    src={property.images[2 % property.images.length]?.data}
                    alt={`${property.name} view 3`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* View all photos button */}
                  {property.images.length > 3 && (
                    <div 
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPhotoModal(0);
                      }}
                    >
                      <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-full flex items-center transition-colors shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        View all {property.images.length} photos
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Title Section with Ratings and Details */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-heading">
              {property.name}
            </h1>
            <p className="text-gray-600 font-body mb-4">{property.city}</p>
            
            {/* Property details */}
            <div className="flex flex-wrap gap-4 mb-4 text-gray-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>{property.guests} Guests</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm2 7v4a1 1 0 001 1h12a1 1 0 001-1v-4h-14z" />
                </svg>
                <span>{property.rooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm7 0a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1z" />
                  <path d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <span>{property.baths} Bathrooms</span>
              </div>
            </div>

            {/* Reviews rating */}
            <div className="flex items-center">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= averageRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-700 font-medium">
                {averageRating}
              </span>
              <span className="mx-2 text-gray-500">•</span>
              <button 
                onClick={scrollToReviews}
                className="text-red-600 hover:underline font-body"
              >
                {reviewCount} Reviews
              </button>
            </div>
          </div>
          
          <div className="text-right mt-4 md:mt-0">
            <div className="text-2xl font-bold text-gray-800 font-heading">
              ₹{property.price}
            </div>
            <p className="text-gray-600 font-body">per night</p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8">
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:w-2/3">
            {/* About this place */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 font-heading text-left">
                About this place
              </h2>
              <div className="text-gray-700 font-body text-left leading-relaxed">
                {property.description}
              </div>
            </div>

          {/* Amenities */}
<div className="mb-16 bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-8 font-heading text-left">
    Amenities
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
    {property.amenities && property.amenities.map((amenity, index) => (
      <div key={index} className="flex items-center text-left">
        <div className="mr-3 text-blue-500">
          <i className={`fas ${amenity.icon} text-lg`}></i>
        </div>
        <span className="font-body">{amenity.name}</span>
      </div>
    ))}
  </div>
</div>

// Find this section in your code
{/* Reviews Section */}
<div className="mb-16 bg-white rounded-lg shadow-md p-6" ref={reviewsRef}>
  <h2 className="text-2xl font-bold mb-4 font-heading text-left">
    Guest Reviews
  </h2>
  <div className="flex items-center mb-6">
    <div className="flex mr-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= averageRating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-xl font-bold text-gray-800 mr-2">
      {averageRating}
    </span>
    <span className="text-gray-600 font-body">
      ({reviewCount} reviews)
    </span>
  </div>

  {property.reviews && property.reviews.length > 0 ? (
    <div className="space-y-6">
      {property.reviews.map((review, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
          <div className="flex items-start">
            <img 
              src={review.profilePicture} 
              alt={review.userName} 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div className="flex-1 overflow-hidden"> {/* Added overflow-hidden here */}
              <div className="flex items-center mb-1">
                <h4 className="font-medium text-gray-800 mr-2">{review.userName}</h4>
                {review.isActive && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Verified Stay</span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <p className="text-gray-700 break-words">{review.description}</p> {/* Added break-words here */}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-6 text-gray-500">
      No reviews yet for this property.
    </div>
  )}
</div>

            {/* Brochure */}
            {property.brochureLink && (
              <div className="mb-16 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-8 font-heading text-left">
                  Brochure
                </h2>
                <div className="flex justify-start text-left">
                  <a
                    href={property.brochureLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded font-body hover:bg-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    Download Brochure
                  </a>
                </div>
              </div>
            )}

            {/* Location Map */}
            {property.mapLink && (
              <div className="mb-16 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-8 font-heading text-left">
                  Location
                </h2>
                <div className="rounded-lg overflow-hidden h-96 shadow-md">
                  <iframe
                    src={property.mapLink}
                    width="100%"
                    height="100%"
                    title="Property Location"
                    frameBorder="0"
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24 border border-gray-200">
              <h2 className="text-xl font-bold mb-8 font-heading text-left">
                Get Assistance for Villa Search
              </h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="FirstName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded font-body"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="LastName"
                      className="w-full p-3 border border-gray-300 rounded font-body"
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded font-body"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded font-body"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500 font-body">Check in</span>
                    <span className="text-sm text-gray-500 font-body">Check out</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded font-body"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded font-body"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Guest"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded font-body"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Children"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded font-body"
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Location"
                    defaultValue={property.city}
                    className="w-full p-3 border border-gray-300 rounded font-body"
                  />
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
                  className={`w-full p-3 bg-gray-700 text-white rounded font-body ${
                    submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                >
                  {submitting ? 'Sending...' : 'Send application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    {/* Photo gallery modal */}
{showAllPhotos && (
  <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
    <div className="max-w-4xl w-full mx-auto my-6 bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Modal header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 font-heading">All Photos</h3>
        <button 
          onClick={() => setShowAllPhotos(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none px-4">
        <button 
          onClick={() => setCurrentModalImage(prev => 
            prev === 0 ? property.images.length - 1 : prev - 1
          )}
          className="text-gray-700 hover:text-gray-900 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all pointer-events-auto"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={() => setCurrentModalImage(prev => 
            prev === property.images.length - 1 ? 0 : prev + 1
          )}
          className="text-gray-700 hover:text-gray-900 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all pointer-events-auto"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Photos - one per viewport with scrolling */}
      <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
        <div className="flex flex-col space-y-6">
          {property.images.map((image, index) => (
            <div 
              key={index} 
              className="w-full"
              ref={el => modalImagesRef.current[index] = el}
              id={`modal-image-${index}`}
            >
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="relative">
                  <img 
                    src={image.data} 
                    alt={`${property.name} - Photo ${index + 1}`} 
                    className="w-full h-auto object-contain rounded mx-auto"
                    style={{ maxHeight: '60vh' }}
                  />
                  
                  {/* Image counter badge */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {index + 1} / {property.images.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
<Footer/>
    </div>
  );
};

export default PropertyDetails;