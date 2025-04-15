// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const BlogManagement = () => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [formData, setFormData] = useState({
//     title: '',
//     description: ''
//   });
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const [backgroundPreview, setBackgroundPreview] = useState('');
//   const [mustVisitThings, setMustVisitThings] = useState([
//     { heading: '', description: '', image: null, preview: '', isNew: true }
//   ]);
//   const [blogs, setBlogs] = useState([]);
//   const [editingBlog, setEditingBlog] = useState(null);

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
//       setBlogs(response.data);
//     } catch (error) {
//       console.error('Error fetching blogs:', error);
//       setMessage({ text: 'Failed to fetch blogs', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBackgroundImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setBackgroundImage(e.target.files[0]);
//       setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const handleMustVisitChange = (index, field, value) => {
//     const updatedItems = [...mustVisitThings];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: value
//     };
//     setMustVisitThings(updatedItems);
//   };

//   const handleMustVisitImageChange = (index, e) => {
//     if (e.target.files && e.target.files[0]) {
//       const updatedItems = [...mustVisitThings];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         image: e.target.files[0],
//         preview: URL.createObjectURL(e.target.files[0])
//       };
//       setMustVisitThings(updatedItems);
//     }
//   };

//   const addMustVisitItem = () => {
//     setMustVisitThings([
//       ...mustVisitThings,
//       { heading: '', description: '', image: null, preview: '', isNew: true }
//     ]);
//   };

//   const removeMustVisitItem = (index) => {
//     const updatedItems = [...mustVisitThings];
//     updatedItems.splice(index, 1);
//     setMustVisitThings(updatedItems);
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: ''
//     });
//     setBackgroundImage(null);
//     setBackgroundPreview('');
//     setMustVisitThings([
//       { heading: '', description: '', image: null, preview: '', isNew: true }
//     ]);
//     setEditingBlog(null);
//   };

//   const prepareFormData = () => {
//     const blogFormData = new FormData();
    
//     // Add text fields
//     blogFormData.append('title', formData.title);
//     blogFormData.append('description', formData.description);
    
//     // Add background image
//     if (backgroundImage) {
//       blogFormData.append('backgroundImage', backgroundImage);
//     }
    
//     // Prepare must visit things data
//     const mustVisitData = mustVisitThings.map((item, index) => {
//       const itemData = {
//         heading: item.heading,
//         description: item.description
//       };
      
//       // If we're editing and this is an existing item, include its ID
//       if (item.id) {
//         itemData.id = item.id;
//       }
      
//       return itemData;
//     });
    
//     blogFormData.append('mustVisitData', JSON.stringify(mustVisitData));
    
//     // Add images for must visit things
//     const imageMap = {};
//     let imageIndex = 0;
    
//     mustVisitThings.forEach((item, index) => {
//       if (item.image) {
//         if (item.id) {
//           // This is an existing item, map its ID to the image index
//           imageMap[item.id] = imageIndex;
//         } else {
//           // This is a new item, use a temporary ID
//           imageMap[`new-${index}`] = imageIndex;
//         }
        
//         blogFormData.append('mustVisitImages', item.image);
//         imageIndex++;
//       }
//     });
    
//     // If we have an image map, add it
//     if (Object.keys(imageMap).length > 0) {
//       blogFormData.append('imageMap', JSON.stringify(imageMap));
//     }
    
//     return blogFormData;
//   };

//   const validateForm = () => {
//     if (!formData.title || !formData.description) {
//       setMessage({ text: 'Title and description are required', type: 'error' });
//       return false;
//     }
    
//     if (!backgroundImage && !editingBlog) {
//       setMessage({ text: 'Background image is required', type: 'error' });
//       return false;
//     }
    
//     // Check if all must visit things have required fields
//     for (let i = 0; i < mustVisitThings.length; i++) {
//       const item = mustVisitThings[i];
//       if (!item.heading || !item.description) {
//         setMessage({ 
//           text: `Must visit item #${i+1} is missing heading or description`, 
//           type: 'error' 
//         });
//         return false;
//       }
      
//       if (!item.image && item.isNew) {
//         setMessage({ 
//           text: `Must visit item #${i+1} is missing an image`, 
//           type: 'error' 
//         });
//         return false;
//       }
//     }
    
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
//     setMessage({ text: '', type: '' });
    
//     try {
//       const blogFormData = prepareFormData();
      
//       if (editingBlog) {
//         // Update blog
//         await axios.put(
//           `${process.env.REACT_APP_API_URL}/api/blogs/${editingBlog._id}`, 
//           blogFormData,
//           {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           }
//         );
//         setMessage({ text: 'Blog updated successfully!', type: 'success' });
//       } else {
//         // Create new blog
//         await axios.post(
//           `${process.env.REACT_APP_API_URL}/api/blogs`, 
//           blogFormData,
//           {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           }
//         );
//         setMessage({ text: 'Blog created successfully!', type: 'success' });
//       }
      
//       // Reset form
//       resetForm();
      
//       // Refresh blogs list
//       fetchBlogs();
//     } catch (error) {
//       console.error('Error saving blog:', error);
//       setMessage({ 
//         text: `Failed to ${editingBlog ? 'update' : 'create'} blog: ${error.response?.data?.message || error.message}`, 
//         type: 'error' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingBlog(blog);
//     setFormData({
//       title: blog.title,
//       description: blog.description
//     });
    
//     if (blog.backgroundImage?.data) {
//       setBackgroundPreview(blog.backgroundImage.data);
//     }
    
//     // Set up must visit things
//     if (blog.mustVisitThings && blog.mustVisitThings.length > 0) {
//       const formattedItems = blog.mustVisitThings.map(item => ({
//         id: item._id,
//         heading: item.heading,
//         description: item.description,
//         preview: item.image?.data || '',
//         isNew: false
//       }));
//       setMustVisitThings(formattedItems);
//     } else {
//       setMustVisitThings([
//         { heading: '', description: '', image: null, preview: '', isNew: true }
//       ]);
//     }
//   };

//   const handleDelete = async (blogId) => {
//     if (window.confirm('Are you sure you want to delete this blog?')) {
//       try {
//         await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}`);
//         setMessage({ text: 'Blog deleted successfully!', type: 'success' });
//         fetchBlogs();
//       } catch (error) {
//         console.error('Error deleting blog:', error);
//         setMessage({ text: 'Failed to delete blog', type: 'error' });
//       }
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6 font-poppins">Blog Management</h2>
      
//       {/* Message display */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded font-poppins ${
//           message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* Blog Form */}
//       <div className="bg-white p-6 rounded-lg shadow mb-12">
//         <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2">
//           {editingBlog ? 'Edit Blog' : 'Add New Blog'}
//         </h3>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//               Title *
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//             />
//           </div>
          
//           {/* Background Image */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//               Background Image *
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleBackgroundImageChange}
//               className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//             />
            
//             {backgroundPreview && (
//               <div className="mt-2">
//                 <img
//                   src={backgroundPreview}
//                   alt="Background preview"
//                   className="h-40 w-auto object-cover rounded-md"
//                 />
//               </div>
//             )}
//           </div>
          
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//               Description *
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
          
//           {/* Must Visit Things */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="block text-sm font-medium text-gray-700 font-poppins">
//                 Must Visit Things *
//               </label>
//               <button
//                 type="button"
//                 onClick={addMustVisitItem}
//                 className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-poppins"
//               >
//                 + Add Item
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {mustVisitThings.map((item, index) => (
//                 <div key={index} className="border p-4 rounded-md relative">
//                   {mustVisitThings.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeMustVisitItem(index)}
//                       className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   )}
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Heading */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                         Heading *
//                       </label>
//                       <input
//                         type="text"
//                         value={item.heading}
//                         onChange={(e) => handleMustVisitChange(index, 'heading', e.target.value)}
//                         required
//                         className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//                       />
//                     </div>
                    
//                     {/* Image */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                         Image *
//                       </label>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleMustVisitImageChange(index, e)}
//                         className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//                       />
//                       {item.preview && (
//                         <div className="mt-2">
//                           <img
//                             src={item.preview}
//                             alt={`Item ${index + 1} preview`}
//                             className="h-24 w-auto object-cover rounded-md"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Description */}
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
//                       Description *
//                     </label>
//                     <textarea
//                       value={item.description}
//                       onChange={(e) => handleMustVisitChange(index, 'description', e.target.value)}
//                       required
//                       rows="3"
//                       className="w-full p-2 border border-gray-300 rounded-md font-poppins"
//                     ></textarea>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-4">
//             {editingBlog && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-6 py-2 bg-gray-300 text-[#13130F] rounded-md hover:bg-gray-400 transition-colors font-poppins"
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
//               {loading ? 'Saving...' : editingBlog ? 'Update Blog' : 'Add Blog'}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Blogs List */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2">Existing Blogs</h3>
        
//         {loading && blogs.length === 0 ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Blog</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Must Visit Items</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Date</th>
//                   <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {blogs.map((blog) => (
//                   <tr key={blog._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0">
//                           {blog.backgroundImage?.data ? (
//                             <img className="h-10 w-10 rounded-full object-cover" src={blog.backgroundImage.data} alt={blog.title} />
//                           ) : (
//                             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M8 18h4m-4-6h12a2 2 0 002-2v-1M8 18V6a2 2 0 012-2h2" />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4 max-w-md">
//                           <div className="text-sm font-medium text-gray-900 truncate font-poppins">{blog.title}</div>
//                           <div className="text-sm text-gray-500 truncate font-poppins">{blog.description ? blog.description.substring(0, 50) + '...' : 'No description'}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
//                       {blog.mustVisitThings?.length || 0} items
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
//                       {new Date(blog.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                       <button
//                         onClick={() => handleEdit(blog)}
//                         className="text-blue-600 hover:text-blue-900 mr-4 font-poppins"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(blog._id)}
//                         className="text-red-600 hover:text-red-900 font-poppins"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
                
//                 {blogs.length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 font-poppins">
//                       No blogs found. Create your first blog!
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

// export default BlogManagement;

// frontend/src/pages/admin/BlogManagement.js
// This file is for backward compatibility
// It just re-exports the AddBlog component

import AddBlog from './AddBlog';

const BlogManagement = (props) => {
  return <AddBlog {...props} />;
};

export default BlogManagement;