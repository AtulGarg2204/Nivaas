// // frontend/src/pages/admin/ReviewManagement.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReviewManagement = () => {
//   const [reviews, setReviews] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [formData, setFormData] = useState({
//     userName: '',
//     cityId: '',
//     city: '',
//     rating: 5,
//     description: ''
//   });
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [profilePreview, setProfilePreview] = useState('');
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchCities();
//     fetchReviews();
//   }, []);

//   const fetchCities = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
//       setCities(res.data);
      
//       // Set default city if cities are loaded
//       if (res.data.length > 0) {
//         setFormData(prev => ({
//           ...prev,
//           cityId: res.data[0]._id,
//           city: res.data[0].name
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//       setMessage({ text: 'Failed to fetch cities', type: 'error' });
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews`);
//       setReviews(response.data);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       setMessage({ text: 'Failed to fetch reviews', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // If city selection changes, update both cityId and city name
//     if (name === 'cityId') {
//       const selectedCity = cities.find(city => city._id === value);
//       setFormData(prev => ({
//         ...prev,
//         cityId: value,
//         city: selectedCity ? selectedCity.name : ''
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleProfilePictureChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//       setProfilePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!profilePicture && !editingId) {
//       setMessage({ text: 'Please upload a profile picture', type: 'error' });
//       return;
//     }
    
//     if (!formData.cityId) {
//       setMessage({ text: 'Please select a city', type: 'error' });
//       return;
//     }
    
//     setLoading(true);
//     setMessage({ text: '', type: '' });
    
//     try {
//       // Create form data for submission
//       const formDataToSubmit = new FormData();
      
//       // Add text fields
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSubmit.append(key, value);
//       });
      
//       // Add profile picture if available
//       if (profilePicture) {
//         formDataToSubmit.append('profilePicture', profilePicture);
//       }
      
//       // Submit the form data
//       if (editingId) {
//         await axios.put(
//           `${process.env.REACT_APP_API_URL}/api/reviews/${editingId}`, 
//           formDataToSubmit,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         setMessage({ text: 'Review updated successfully!', type: 'success' });
//       } else {
//         await axios.post(
//           `${process.env.REACT_APP_API_URL}/api/reviews`, 
//           formDataToSubmit,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         setMessage({ text: 'Review created successfully!', type: 'success' });
//       }
      
//       // Reset form
//       setFormData({
//         userName: '',
//         cityId: cities.length > 0 ? cities[0]._id : '',
//         city: cities.length > 0 ? cities[0].name : '',
//         rating: 5,
//         description: ''
//       });
//       setProfilePicture(null);
//       setProfilePreview('');
//       setEditingId(null);
      
//       // Refresh reviews list
//       fetchReviews();
//     } catch (error) {
//       console.error('Error saving review:', error);
//       setMessage({ 
//         text: `Failed to save review: ${error.response?.data?.message || error.message}`, 
//         type: 'error' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleEdit = (review) => {
//     setFormData({
//       userName: review.userName,
//       cityId: review.cityId,
//       city: review.city,
//       rating: review.rating,
//       description: review.description
//     });
//     setProfilePreview(review.profilePicture);
//     setEditingId(review._id);
//   };
  
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this review?')) {
//       try {
//         setLoading(true);
//         await axios.delete(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`);
//         setMessage({ text: 'Review deleted successfully!', type: 'success' });
//         fetchReviews();
//       } catch (error) {
//         console.error('Error deleting review:', error);
//         setMessage({ text: 'Failed to delete review', type: 'error' });
//         setLoading(false);
//       }
//     }
//   };

//   // Generate star rating display
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span key={i} className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 font-poppins">Review Management</h2>
      
//       {/* Message display */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded font-poppins ${
//           message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* Review Form */}
//       <div className="bg-white p-6 rounded-lg shadow mb-12">
//         <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2">
//           {editingId ? 'Edit Review' : 'Add New Review'}
//         </h3>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* User Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                 User Name *
//               </label>
//               <input
//                 type="text"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//               />
//             </div>
            
//             {/* City Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                 City *
//               </label>
//               <select
//                 name="cityId"
//                 value={formData.cityId}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//               >
//                 <option value="">Select a city</option>
//                 {cities.map(city => (
//                   <option key={city._id} value={city._id}>
//                     {city.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             {/* Rating */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                 Rating *
//               </label>
//               <div className="flex items-center">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
//                     className="text-2xl focus:outline-none"
//                   >
//                     <span className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}>
//                       ★
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Profile Picture */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                 Profile Picture *
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePictureChange}
//                 className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//                 {...(!editingId && { required: true })}
//               />
              
//               {/* Profile Picture Preview */}
//               {profilePreview && (
//                 <div className="mt-2">
//                   <img 
//                     src={profilePreview}
//                     alt="Profile Preview"
//                     className="h-16 w-16 rounded-full object-cover border"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//               Review Description *
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows="4"
//               className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//             ></textarea>
//           </div>
          
//           {/* Submit Button */}
//           <div className="flex justify-end">
//             {editingId && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFormData({
//                     userName: '',
//                     cityId: cities.length > 0 ? cities[0]._id : '',
//                     city: cities.length > 0 ? cities[0].name : '',
//                     rating: 5,
//                     description: ''
//                   });
//                   setProfilePicture(null);
//                   setProfilePreview('');
//                   setEditingId(null);
//                 }}
//                 className="mr-4 px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-poppins"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-6 py-2 rounded-md text-white font-poppins ${
//                 loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//             >
//               {loading ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Reviews List */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2">Existing Reviews</h3>
        
//         {loading && !reviews.length ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">User</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">City</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Rating</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Description</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Status</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reviews.map((review) => (
//                   <tr key={review._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           <img className="h-10 w-10 rounded-full object-cover" src={review.profilePicture} alt={review.userName} />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900 font-poppins">{review.userName}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 font-poppins">{review.city}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex">{renderStars(review.rating)}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 font-poppins truncate max-w-xs">{review.description}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-poppins ${
//                         review.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {review.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button 
//                         onClick={() => handleEdit(review)}
//                         className="text-blue-600 hover:text-blue-900 mr-3 font-poppins"
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(review._id)}
//                         className="text-red-600 hover:text-red-900 font-poppins"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
                
//                 {!loading && reviews.length === 0 && (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 font-poppins">
//                       No reviews found. Add your first review!
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewManagement;

// frontend/src/pages/admin/ReviewManagement.js
// This file is for backward compatibility
// It just re-exports the AddReview component

import AddReview from './AddReview';

const ReviewManagement = (props) => {
  return <AddReview {...props} />;
};

export default ReviewManagement;