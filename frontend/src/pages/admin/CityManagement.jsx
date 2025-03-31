
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Upload, X, PlusCircle } from 'lucide-react';

// const CityManagement = () => {
//   const [cities, setCities] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     image: '',
//     isActive: true,
//     thingsToDo: []
//   });
//   console.log(cities);
//   const [newThingToDo, setNewThingToDo] = useState({
//     image: '',
//     heading: '',
//     description: ''
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });

//   useEffect(() => {
//     fetchCities();
//   }, []);

//   const fetchCities = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
//       setCities(res.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//       setMessage({ text: 'Failed to fetch cities', type: 'error' });
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleThingToDoChange = (e) => {
//     const { name, value } = e.target;
//     setNewThingToDo({
//       ...newThingToDo,
//       [name]: value
//     });
//   };

//   const addThingToDo = () => {
//     // Validate all fields are filled
//     if (!newThingToDo.image || !newThingToDo.heading || !newThingToDo.description) {
//       setMessage({ text: 'All fields for Things to Do are required', type: 'error' });
//       return;
//     }

//     setFormData({
//       ...formData,
//       thingsToDo: [...formData.thingsToDo, { ...newThingToDo }]
//     });
    
//     // Reset the thingToDo form
//     setNewThingToDo({
//       image: '',
//       heading: '',
//       description: ''
//     });
    
//     setMessage({ text: '', type: '' });
//   };

//   const removeThingToDo = (index) => {
//     const updatedThingsToDo = [...formData.thingsToDo];
//     updatedThingsToDo.splice(index, 1);
    
//     setFormData({
//       ...formData,
//       thingsToDo: updatedThingsToDo
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate city name and image
//     if (!formData.name || !formData.image) {
//       setMessage({ text: 'City name and image are required', type: 'error' });
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setMessage({ text: '', type: '' });
      
//       if (editingId) {
//         await axios.put(`${process.env.REACT_APP_API_URL}/api/cities/${editingId}`, formData);
//         setMessage({ text: 'City updated successfully!', type: 'success' });
//       } else {
//         await axios.post(`${process.env.REACT_APP_API_URL}/api/cities`, formData);
//         setMessage({ text: 'City created successfully!', type: 'success' });
//       }
      
//       // Reset form
//       setFormData({
//         name: '',
//         image: '',
//         isActive: true,
//         thingsToDo: []
//       });
//       setEditingId(null);
//       fetchCities();
      
//     } catch (error) {
//       console.error('Error saving city:', error);
//       setMessage({ text: `Failed to ${editingId ? 'update' : 'create'} city`, type: 'error' });
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Message display */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded font-body ${
//           message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
//         <h3 className="text-xl font-bold mb-6 text-left font-heading border-b pb-2">
//           {editingId ? 'Edit City' : 'Add New City'}
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="name">
//               City Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="image">
//               City Image URL
//             </label>
//             <div className="flex">
//               <input
//                 type="text"
//                 id="image"
//                 name="image"
//                 value={formData.image}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
//                 required
//               />
//               <button
//                 type="button"
//                 className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-r-md border border-l-0 border-gray-300"
//                 title="Upload Image"
//               >
//                 <Upload size={20} className="text-gray-600" />
//               </button>
//             </div>
//             {formData.image && (
//               <div className="mt-2 relative">
//                 <img 
//                   src={formData.image} 
//                   alt="City preview" 
//                   className="h-32 w-full object-cover rounded-md border border-gray-200" 
//                 />
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="mb-6">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="isActive"
//               name="isActive"
//               checked={formData.isActive}
//               onChange={handleChange}
//               className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
//             />
//             <label htmlFor="isActive" className="ml-2 font-body text-left">Active</label>
//           </div>
//         </div>
        
//         <div className="mt-8 mb-6">
//           <h4 className="text-lg font-bold mb-4 text-left font-heading border-b pb-2">
//             Things to Do
//           </h4>
          
//           {/* List of current things to do */}
//           {formData.thingsToDo.length > 0 && (
//             <div className="mb-6">
//               <h5 className="font-body text-sm text-gray-600 mb-2 text-left">
//                 Current Things to Do ({formData.thingsToDo.length})
//               </h5>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {formData.thingsToDo.map((item, index) => (
//                   <div key={index} className="p-4 border rounded-md bg-white flex justify-between items-start hover:shadow-md transition-shadow">
//                     <div className="flex gap-3">
//                       <div className="flex-shrink-0">
//                         <img 
//                           src={item.image} 
//                           alt={item.heading} 
//                           className="h-20 w-20 object-cover rounded-md border border-gray-200" 
//                         />
//                       </div>
//                       <div>
//                         <h6 className="font-semibold font-heading">{item.heading}</h6>
//                         <p className="text-sm text-gray-600 font-body line-clamp-2">{item.description}</p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeThingToDo(index)}
//                       className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Add new thing to do */}
//           <div className="bg-white p-6 rounded-md border border-gray-200">
//             <h5 className="font-heading font-bold mb-4 text-left border-b pb-2">Add New Thing to Do</h5>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-gray-700 mb-2 font-body text-sm text-left" htmlFor="thingImage">
//                   Image URL
//                 </label>
//                 <div className="flex">
//                   <input
//                     type="text"
//                     id="thingImage"
//                     name="image"
//                     value={newThingToDo.image}
//                     onChange={handleThingToDoChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
//                   />
//                   <button
//                     type="button"
//                     className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-r-md border border-l-0 border-gray-300"
//                     title="Upload Image"
//                   >
//                     <Upload size={20} className="text-gray-600" />
//                   </button>
//                 </div>
//                 {newThingToDo.image && (
//                   <div className="mt-2">
//                     <img 
//                       src={newThingToDo.image} 
//                       alt="Preview" 
//                       className="h-24 w-full object-cover rounded-md border border-gray-200" 
//                     />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2 font-body text-sm text-left" htmlFor="thingHeading">
//                   Heading
//                 </label>
//                 <input
//                   type="text"
//                   id="thingHeading"
//                   name="heading"
//                   value={newThingToDo.heading}
//                   onChange={handleThingToDoChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 mb-2 font-body text-sm text-left" htmlFor="thingDescription">
//                   Description
//                 </label>
//                 <textarea
//                   id="thingDescription"
//                   name="description"
//                   value={newThingToDo.description}
//                   onChange={handleThingToDoChange}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
//                 ></textarea>
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={addThingToDo}
//               className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-md font-body hover:bg-green-600 transition-colors"
//             >
//               <PlusCircle size={18} />
//               Add Thing to Do
//             </button>
//           </div>
//         </div>
        
//         <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
//           {editingId && (
//             <button
//               type="button"
//               onClick={() => {
//                 setFormData({
//                   name: '',
//                   image: '',
//                   isActive: true,
//                   thingsToDo: []
//                 });
//                 setEditingId(null);
//               }}
//               className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md mr-3 font-body"
//             >
//               Cancel
//             </button>
//           )}
//           <button
//             type="submit"
//             className={`px-5 py-2 rounded-md text-white font-body flex items-center gap-2 ${
//               loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : editingId ? 'Update City' : 'Add City'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CityManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, PlusCircle } from 'lucide-react';

const CityManagement = ({ editingCity, onEditComplete }) => {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    isActive: true,
    thingsToDo: []
  });
  
  const [cityImage, setCityImage] = useState(null);
  const [cityImagePreview, setCityImagePreview] = useState('');
  
  const [thingImage, setThingImage] = useState(null);
  const [thingImagePreview, setThingImagePreview] = useState('');
  
  const [newThingToDo, setNewThingToDo] = useState({
    image: '',
    heading: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCities();
  }, []);

  // Populate form if editing a city
  useEffect(() => {
    if (editingCity) {
      setFormData({
        name: editingCity.name || '',
        image: editingCity.image || '',
        isActive: editingCity.isActive !== undefined ? editingCity.isActive : true,
        thingsToDo: editingCity.thingsToDo || []
      });
      
      // Set image preview if there's an image URL
      if (editingCity.image) {
        // Check if it's a base64 string
        if (editingCity.image.startsWith('data:')) {
          setCityImagePreview(editingCity.image);
        } 
        // Handle external URLs
        else {
          setCityImagePreview(editingCity.image);
        }
      }
    }
  }, [editingCity]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
      setCities(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setMessage({ text: 'Failed to fetch cities', type: 'error' });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThingToDoChange = (e) => {
    const { name, value } = e.target;
    setNewThingToDo({
      ...newThingToDo,
      [name]: value
    });
  };

  // Handle city image upload
  const handleCityImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCityImage(file);
      setFormData(prev => ({ ...prev, image: '' })); // Clear any existing URL
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCityImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle thing to do image upload
  const handleThingImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThingImage(file);
      setNewThingToDo(prev => ({ ...prev, image: '' })); // Clear any existing URL
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addThingToDo = () => {
    // Validate all fields are filled
    if ((!newThingToDo.image && !thingImagePreview) || !newThingToDo.heading || !newThingToDo.description) {
      setMessage({ text: 'All fields for Things to Do are required', type: 'error' });
      return;
    }

    // Use the preview (base64) if a file was uploaded, otherwise use the URL
    const imageToAdd = thingImagePreview || newThingToDo.image;

    setFormData({
      ...formData,
      thingsToDo: [...formData.thingsToDo, { 
        ...newThingToDo,
        image: imageToAdd
      }]
    });
    
    // Reset the thingToDo form
    setNewThingToDo({
      image: '',
      heading: '',
      description: ''
    });
    setThingImage(null);
    setThingImagePreview('');
    
    setMessage({ text: '', type: '' });
  };

  const removeThingToDo = (index) => {
    const updatedThingsToDo = [...formData.thingsToDo];
    updatedThingsToDo.splice(index, 1);
    
    setFormData({
      ...formData,
      thingsToDo: updatedThingsToDo
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate city name and image
    if (!formData.name || (!formData.image && !cityImagePreview)) {
      setMessage({ text: 'City name and image are required', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // Create the final data to submit
      const cityData = {
        ...formData,
        // If we have a preview (from file upload), use that instead of any URL
        image: cityImagePreview || formData.image
      };
      
      if (editingCity) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/cities/${editingCity._id}`, cityData);
        setMessage({ text: 'City updated successfully!', type: 'success' });
        if (onEditComplete) onEditComplete();
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/cities`, cityData);
        setMessage({ text: 'City created successfully!', type: 'success' });
      }
      
      // Reset form
      setFormData({
        name: '',
        image: '',
        isActive: true,
        thingsToDo: []
      });
      setCityImage(null);
      setCityImagePreview('');
      fetchCities();
      
    } catch (error) {
      console.error('Error saving city:', error);
      setMessage({ text: `Failed to ${editingCity ? 'update' : 'create'} city`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Message display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded font-body ${
          message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-left font-heading border-b pb-2">
          {editingCity ? 'Edit City' : 'Add New City'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="name">
              City Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="image">
              City Image
            </label>
            <div className="flex flex-col space-y-4">
              {/* File Upload Input */}
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                <label htmlFor="cityImageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="cityImageUpload"
                  accept="image/*"
                  onChange={handleCityImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
                  disabled={!!cityImage}
                />
              </div>
            </div>
            
            {/* Image Preview */}
            {(cityImagePreview || formData.image) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <img 
                  src={cityImagePreview || formData.image} 
                  alt="City preview" 
                  className="h-32 w-full object-cover rounded-md border border-gray-200" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="isActive" className="ml-2 font-body text-left">Active</label>
          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h4 className="text-lg font-bold mb-4 text-left font-heading border-b pb-2">
            Things to Do
          </h4>
          
          {/* List of current things to do */}
          {formData.thingsToDo.length > 0 && (
            <div className="mb-6">
              <h5 className="font-body text-sm text-gray-600 mb-2 text-left">
                Current Things to Do ({formData.thingsToDo.length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.thingsToDo.map((item, index) => (
                  <div key={index} className="p-4 border rounded-md bg-white flex justify-between items-start hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.heading} 
                          className="h-20 w-20 object-cover rounded-md border border-gray-200" 
                        />
                      </div>
                      <div>
                        <h6 className="font-semibold font-heading">{item.heading}</h6>
                        <p className="text-sm text-gray-600 font-body line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeThingToDo(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add new thing to do */}
          <div className="bg-white p-6 rounded-md border border-gray-200">
            <h5 className="font-heading font-bold mb-4 text-left border-b pb-2">Add New Thing to Do</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 font-body text-sm text-left">
                  Image
                </label>
                <div className="flex flex-col space-y-4">
                  {/* File Upload Input */}
                  <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <label htmlFor="thingImageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="thingImageUpload"
                      accept="image/*"
                      onChange={handleThingImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  
                  {/* OR Divider */}
                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="thingImage">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="thingImage"
                      name="image"
                      value={newThingToDo.image}
                      onChange={handleThingToDoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
                      disabled={!!thingImage}
                    />
                  </div>
                </div>
                
                {/* Image Preview */}
                {(thingImagePreview || newThingToDo.image) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <img 
                      src={thingImagePreview || newThingToDo.image} 
                      alt="Thing to do preview" 
                      className="h-24 w-full object-cover rounded-md border border-gray-200" 
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-body text-sm text-left" htmlFor="thingHeading">
                  Heading
                </label>
                <input
                  type="text"
                  id="thingHeading"
                  name="heading"
                  value={newThingToDo.heading}
                  onChange={handleThingToDoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-body text-sm text-left" htmlFor="thingDescription">
                  Description
                </label>
                <textarea
                  id="thingDescription"
                  name="description"
                  value={newThingToDo.description}
                  onChange={handleThingToDoChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
                ></textarea>
              </div>
            </div>
            <button
              type="button"
              onClick={addThingToDo}
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-md font-body hover:bg-green-600 transition-colors"
            >
              <PlusCircle size={18} />
              Add Thing to Do
            </button>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          {editingCity && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  image: '',
                  isActive: true,
                  thingsToDo: []
                });
                setCityImage(null);
                setCityImagePreview('');
                if (onEditComplete) onEditComplete();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md mr-3 font-body"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`px-5 py-2 rounded-md text-white font-body flex items-center gap-2 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : editingCity ? 'Update City' : 'Add City'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CityManagement;