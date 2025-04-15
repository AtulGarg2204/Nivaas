import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Star } from 'lucide-react';

const AddReview = ({ editingReview = null, onEditComplete = () => {} }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    userName: '',
    cityId: '',
    city: '',
    propertyId: '', // Property ID field
    propertyName: '', // Property name field
    rating: 5,
    description: '',
    source: 'airbnb', // Default source as direct
    isActive: true
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Review sources - matching the sources from the Property component
  const reviewSources = [
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'makemytrip', label: 'MakeMyTrip' },
    { value: 'goibibo', label: 'Goibibo' },
    { value: 'google', label: 'Google' },
   
  ];

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set form data when editing review is provided
  useEffect(() => {
    if (editingReview) {
      setFormData({
        userName: editingReview.userName || '',
        cityId: editingReview.cityId || '',
        city: editingReview.city || '',
        propertyId: editingReview.propertyId || '',
        propertyName: editingReview.propertyName || '',
        rating: editingReview.rating || 5,
        description: editingReview.description || '',
        source: editingReview.source || editingReview.referenceApp?.name || 'airbnb',
        isActive: editingReview.isActive !== undefined ? editingReview.isActive : true
      });
      
      if (editingReview.profilePicture) {
        setProfilePreview(editingReview.profilePicture);
      }
      
      setEditingId(editingReview._id);
    }
  }, [editingReview]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
      setProperties(res.data);
      
      // Set default property if properties are loaded and we're not editing
      if (res.data.length > 0 && !editingReview) {
        // Find the city from the first property
        const firstProperty = res.data[0];
        setFormData(prev => ({
          ...prev,
          propertyId: firstProperty._id,
          propertyName: firstProperty.name || '',
          cityId: firstProperty.cityId,
          city: firstProperty.city || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setMessage({ text: 'Failed to fetch properties', type: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If property selection changes, update cityId and city name
    if (name === 'propertyId') {
      const selectedProperty = properties.find(property => property._id === value);
      if (selectedProperty) {
        setFormData(prev => ({
          ...prev,
          propertyId: value,
          propertyName: selectedProperty.name || '',
          cityId: selectedProperty.cityId,
          city: selectedProperty.city || ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.propertyId) {
      setMessage({ text: 'Please select a property', type: 'error' });
      return;
    }
    
    if (!formData.cityId) {
      setMessage({ text: 'No city associated with the selected property', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Create form data for submission
      const formDataToSubmit = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      
      // Add profile picture if available
      if (profilePicture) {
        formDataToSubmit.append('profilePicture', profilePicture);
      }
      
      // Submit the form data
      if (editingId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/reviews/${editingId}`, 
          formDataToSubmit,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setMessage({ text: 'Review updated successfully!', type: 'success' });
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/reviews`, 
          formDataToSubmit,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setMessage({ text: 'Review created successfully!', type: 'success' });
      }
      
      // Reset form
      setFormData({
        userName: '',
        cityId: properties.length > 0 ? properties[0].cityId : '',
        city: properties.length > 0 ? (properties[0].city || '') : '',
        propertyId: properties.length > 0 ? properties[0]._id : '',
        propertyName: properties.length > 0 ? properties[0].name || '' : '',
        rating: 5,
        description: '',
        source: 'airbnb',
        isActive: true
      });
      setProfilePicture(null);
      setProfilePreview('');
      setEditingId(null);
      
      // Notify parent component that editing is complete
      onEditComplete();
      
    } catch (error) {
      console.error('Error saving review:', error);
      setMessage({ 
        text: `Failed to save review: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Get source icon for visual representation
  const getSourceIcon = (source) => {
    switch(source) {
      case 'airbnb':
        return 'fab fa-airbnb';
      case 'google':
        return 'fab fa-google';
      case 'makemytrip':
        return 'fas fa-plane';
      case 'goibibo':
        return 'fas fa-suitcase';
      default:
        return 'fas fa-comment';
    }
  };

  // Group properties by city for better readability in dropdown
  const propertiesByCity = properties.reduce((acc, property) => {
    const cityName = property.city || 'Unknown City';
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(property);
    return acc;
  }, {});

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
      
      {/* Review Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-6 font-heading border-b pb-2 text-left">
          {editingId ? 'Edit Review' : 'Add New Review'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                User Name *
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Property Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Property *
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a property</option>
                {Object.entries(propertiesByCity).map(([cityName, cityProperties]) => (
                  <optgroup key={cityName} label={cityName}>
                    {cityProperties.map(property => (
                      <option key={property._id} value={property._id}>
                        {property.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Rating *
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="text-2xl focus:outline-none p-1"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Review Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Review Source *
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {reviewSources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <i className={`${getSourceIcon(formData.source)} mr-2`}></i>
                <span>Selected source: {reviewSources.find(s => s.value === formData.source)?.label || 'airbnb'}</span>
              </div>
            </div>
            
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Profile Picture (Optional)
              </label>
              <div className="flex">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-r-md border border-l-0 border-gray-300"
                  title="Upload Image"
                >
                  <Upload size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Profile Picture Preview */}
              {profilePreview && (
                <div className="mt-2">
                  <img 
                    src={profilePreview}
                    alt="Profile Preview"
                    className="h-20 w-20 rounded-full object-cover border border-gray-200"
                  />
                </div>
              )}
            </div>
            
            {/* Active Status */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="isActive" className="ml-2 font-body text-left">
                Active (visible on website)
              </label>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Review Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    userName: '',
                    cityId: properties.length > 0 ? properties[0].cityId : '',
                    city: properties.length > 0 ? (properties[0].city || '') : '',
                    propertyId: properties.length > 0 ? properties[0]._id : '',
                    propertyName: properties.length > 0 ? properties[0].name || '' : '',
                    rating: 5,
                    description: '',
                    source: 'airbnb',
                    isActive: true
                  });
                  setProfilePicture(null);
                  setProfilePreview('');
                  setEditingId(null);
                  onEditComplete();
                }}
                className="bg-gray-300 hover:bg-gray-400 text-[#13130F] px-5 py-2 rounded-md mr-3 font-body"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white font-body flex items-center gap-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;