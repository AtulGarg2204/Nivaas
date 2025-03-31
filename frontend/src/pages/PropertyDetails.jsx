// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";

// const PropertyDetails = () => {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeImage, setActiveImage] = useState(0);
//   const [checkInDate, setCheckInDate] = useState("");
//   const [checkOutDate, setCheckOutDate] = useState("");
//   const [guests, setGuests] = useState("1");
//   const [children, setChildren] = useState("0");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [showAllPhotos, setShowAllPhotos] = useState(false);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/properties/${id}`
//         );
//         setProperty(res.data);
//         setLoading(false);
//         // Scroll to top when property loads
//         window.scrollTo(0, 0);
//       } catch (error) {
//         console.error("Error fetching property:", error);
//         setError("Failed to load property details");
//         setLoading(false);
//       }
//     };

//     fetchProperty();
//   }, [id]);

//   const handleImageClick = (index) => {
//     setActiveImage(index);
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!checkInDate || !checkOutDate || !name || !email || !phone) {
//       setSubmitMessage("Please fill all required fields");
//       return;
//     }
    
//     setSubmitting(true);
//     setSubmitMessage("");
    
//     // Here you would normally send the booking request to your backend
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setSubmitMessage("Your booking request has been submitted. We'll contact you shortly!");
//       // Reset form
//       setCheckInDate("");
//       setCheckOutDate("");
//       setGuests("1");
//       setChildren("0");
//     } catch (error) {
//       setSubmitMessage("There was an error submitting your request. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error || !property) {
//     return (
//       <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
//           <p>{error || "Property not found"}</p>
//           <Link
//             to="/"
//             className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body"
//           >
//             Return to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-28 min-h-screen bg-white">
//       {/* Breadcrumb Navigation */}
//       <div className="bg-white border-b border-gray-100">
//         <div className="container mx-auto px-8 md:px-16 lg:px-24 py-3">
//           <div className="flex items-center text-sm font-body">
//             <Link to="/" className="text-red-600 hover:underline">Home</Link>
//             <span className="mx-2 text-gray-400">›</span>
//             {property.cityId && (
//               <>
//                 <Link to={`/city/${property.cityId}`} className="text-red-600 hover:underline">{property.city || 'City'}</Link>
//                 <span className="mx-2 text-gray-400">›</span>
//               </>
//             )}
//             <span className="text-gray-500">{property.name}</span>
//           </div>
//         </div>
//       </div>

//       {/* Property Gallery Section */}
//       <div className="container mx-auto px-8 md:px-16 lg:px-24 py-6">
//         <div className="flex flex-col md:flex-row">
//           {/* Main large image */}
//           <div className="w-full md:w-2/3 pr-0 md:pr-2 mb-2 md:mb-0">
//             <div className="relative overflow-hidden rounded-lg" style={{ height: "500px" }}>
//               <img
//                 src={property.images[activeImage]?.data}
//                 alt={property.name}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           </div>

//           {/* Two smaller images stacked */}
//           <div className="w-full md:w-1/3 flex flex-row md:flex-col">
//             <div className="w-1/2 md:w-full h-60 md:h-60 pr-1 md:pr-0 md:pb-1">
//               {property.images.length > 1 && (
//                 <div 
//                   className="relative h-full overflow-hidden rounded-lg cursor-pointer"
//                   onClick={() => handleImageClick(1 % property.images.length)}
//                 >
//                   <img
//                     src={property.images[1 % property.images.length]?.data}
//                     alt={`${property.name} view 2`}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="w-1/2 md:w-full h-60 md:h-60 pl-1 md:pl-0">
//               {property.images.length > 2 && (
//                 <div 
//                   className="relative h-full overflow-hidden rounded-lg cursor-pointer"
//                   onClick={() => handleImageClick(2 % property.images.length)}
//                 >
//                   <img
//                     src={property.images[2 % property.images.length]?.data}
//                     alt={`${property.name} view 3`}
//                     className="w-full h-full object-contain"
//                   />
//                   {property.images.length > 3 && (
//                     <div 
//                       className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowAllPhotos(true);
//                       }}
//                     >
//                       <button className="bg-white text-black rounded-full px-4 py-2 font-medium text-sm font-body">
//                         View all {property.images.length} photos
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Property Title Section */}
//       <div className="container mx-auto px-8 md:px-16 lg:px-24 py-8">
//         <div className="flex justify-between items-start">
//           <div className="text-left">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2 font-heading">
//               {property.name}
//             </h1>
//             <p className="text-gray-600 font-body">{property.city}</p>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-gray-800 font-heading">
//               ₹{property.price}
//             </div>
//             <p className="text-gray-600 font-body">per night</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
//           {/* Left Column - 2/3 width */}
//           <div className="lg:w-2/3">
//             {/* About this place */}
//             <div className="mb-12">
//               <h2 className="text-2xl font-bold mb-6 font-heading">
//                 About this place
//               </h2>
//               <div className="text-gray-700 font-body leading-relaxed">
//                 {property.description}
//               </div>
//             </div>

//             {/* Amenities */}
//             <div className="mb-16 bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-2xl font-bold mb-8 font-heading" style={{ textAlign: 'left' }}>
//                 Amenities
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
//                 {property.amenities && property.amenities.map((amenity, index) => (
//                   <div key={index} className="flex items-center text-left">
//                     <div className="mr-3 text-blue-500">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <span className="font-body">{amenity.name || amenity}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Brochure */}
//             {property.brochureLink && (
//               <div className="mb-16 bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-2xl font-bold mb-8 font-heading" style={{ textAlign: 'left' }}>
//                   Brochure
//                 </h2>
//                 <div className="flex justify-start text-left">
//                   <a
//                     href={property.brochureLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded font-body hover:bg-blue-600 transition-colors"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
//                     </svg>
//                     Download Brochure
//                   </a>
//                 </div>
//               </div>
//             )}

//             {/* Location Map */}
//             {property.mapLink && (
//               <div className="mb-16 bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-2xl font-bold mb-8 font-heading" style={{ textAlign: 'left' }}>
//                   Location
//                 </h2>
//                 <div className="rounded-lg overflow-hidden h-96 shadow-md">
//                   <iframe
//                     src={property.mapLink}
//                     width="100%"
//                     height="100%"
//                     title="Property Location"
//                     frameBorder="0"
//                     allowFullScreen
//                     aria-hidden="false"
//                     tabIndex="0"
//                   ></iframe>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - 1/3 width */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow-md p-8 sticky top-24 border border-gray-200">
//               <h2 className="text-xl font-bold mb-8 font-heading" style={{ textAlign: 'left' }}>
//                 Get Assistance for Villa Search
//               </h2>
              
//               <form onSubmit={handleBookingSubmit} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="FirstName"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="w-full p-3 border border-gray-300 rounded font-body"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="LastName"
//                       className="w-full p-3 border border-gray-300 rounded font-body"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <input
//                     type="email"
//                     placeholder="example@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded font-body"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <input
//                     type="tel"
//                     placeholder="Phone Number"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded font-body"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm text-gray-500 font-body">Check in</span>
//                     <span className="text-sm text-gray-500 font-body">Check out</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <input
//                         type="date"
//                         value={checkInDate}
//                         onChange={(e) => setCheckInDate(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded font-body"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <input
//                         type="date"
//                         value={checkOutDate}
//                         onChange={(e) => setCheckOutDate(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded font-body"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <input
//                       type="number"
//                       placeholder="Guest"
//                       value={guests}
//                       onChange={(e) => setGuests(e.target.value)}
//                       min="1"
//                       className="w-full p-3 border border-gray-300 rounded font-body"
//                     />
//                   </div>
//                   <div>
//                     <input
//                       type="number"
//                       placeholder="Children"
//                       value={children}
//                       onChange={(e) => setChildren(e.target.value)}
//                       min="0"
//                       className="w-full p-3 border border-gray-300 rounded font-body"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <input
//                     type="text"
//                     placeholder="Location"
//                     defaultValue={property.city}
//                     className="w-full p-3 border border-gray-300 rounded font-body"
//                   />
//                 </div>
                
//                 {submitMessage && (
//                   <div className={`p-3 rounded font-body text-center ${
//                     submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//                   }`}>
//                     {submitMessage}
//                   </div>
//                 )}
                
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className={`w-full p-3 bg-gray-700 text-white rounded font-body ${
//                     submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
//                   }`}
//                 >
//                   {submitting ? 'Sending...' : 'Send application'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Photo gallery modal */}
//       {showAllPhotos && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
//           <div className="max-w-6xl w-full bg-black rounded-lg">
//             <div className="flex justify-between items-center p-4 border-b border-gray-700">
//               <h3 className="text-xl font-bold text-white font-heading text-left">All Photos</h3>
//               <button 
//                 onClick={() => setShowAllPhotos(false)}
//                 className="text-white hover:text-gray-300"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//               {property.images.map((image, index) => (
//                 <div key={index} className="aspect-video rounded-lg overflow-hidden">
//                   <img 
//                     src={image.data} 
//                     alt={`${property.name} ${index + 1}`} 
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetails;

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";

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

  // Reference for scrolling to reviews section
  const reviewsRef = useRef(null);

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

      {/* Property Gallery Section */}
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Main large image */}
          <div className="w-full md:w-2/3 pr-0 md:pr-2 mb-2 md:mb-0">
            <div className="relative overflow-hidden rounded-lg" style={{ height: "500px" }}>
              <img
                src={property.images[activeImage]?.data}
                alt={property.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Two smaller images stacked */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col">
            <div className="w-1/2 md:w-full h-60 md:h-60 pr-1 md:pr-0 md:pb-1">
              {property.images.length > 1 && (
                <div 
                  className="relative h-full overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(1 % property.images.length)}
                >
                  <img
                    src={property.images[1 % property.images.length]?.data}
                    alt={`${property.name} view 2`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <div className="w-1/2 md:w-full h-60 md:h-60 pl-1 md:pl-0">
              {property.images.length > 2 && (
                <div 
                  className="relative h-full overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(2 % property.images.length)}
                >
                  <img
                    src={property.images[2 % property.images.length]?.data}
                    alt={`${property.name} view 3`}
                    className="w-full h-full object-contain"
                  />
                  {property.images.length > 3 && (
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllPhotos(true);
                      }}
                    >
                      <button className="bg-white text-black rounded-full px-4 py-2 font-medium text-sm font-body">
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
              <div className="text-gray-700 font-body leading-relaxed">
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-body">{amenity.name || amenity}</span>
                  </div>
                ))}
              </div>
            </div>

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
                        <div className="flex-1">
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
                          <p className="text-gray-700">{review.description}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full bg-black rounded-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white font-heading text-left">All Photos</h3>
              <button 
                onClick={() => setShowAllPhotos(false)}
                className="text-white hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {property.images.map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={image.data} 
                    alt={`${property.name} ${index + 1}`} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;