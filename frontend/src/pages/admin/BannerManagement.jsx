import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';

const BannerManagement = ({ editingBanner = null, onEditComplete = () => {} }) => {
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    isActive: true,
    order: 0
  });
  
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  // Set form data when editing banner is provided
  useEffect(() => {
    if (editingBanner) {
      setFormData({
        title: editingBanner.title || '',
        subtitle: editingBanner.subtitle || '',
        imageUrl: editingBanner.imageUrl || '',
        isActive: editingBanner.isActive !== undefined ? editingBanner.isActive : true,
        order: editingBanner.order || 0
      });
      setEditingId(editingBanner._id);
      
      // Set image preview if there's an image URL
      if (editingBanner.imageUrl) {
        setImagePreview(editingBanner.imageUrl);
      }
    }
  }, [editingBanner]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/banners`);
      setBanners(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setMessage({ text: 'Failed to fetch banners', type: 'error' });
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setFormData(prev => ({ ...prev, imageUrl: '' })); // Clear any existing URL
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || (!formData.imageUrl && !imagePreview)) {
      setMessage({ text: 'Title and image are required', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      // If we have an image preview (from file upload), use that instead of the URL
      const finalData = {
        ...formData,
        imageUrl: imagePreview || formData.imageUrl
      };
      
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/banners/${editingId}`, finalData);
        setMessage({ text: 'Banner updated successfully!', type: 'success' });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/banners`, finalData);
        setMessage({ text: 'Banner created successfully!', type: 'success' });
      }
      
      // Reset form
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        isActive: true,
        order: 0
      });
      setBannerImage(null);
      setImagePreview('');
      setEditingId(null);
      fetchBanners();
      onEditComplete(); // Notify parent that editing is complete
    } catch (error) {
      console.error('Error saving banner:', error);
      setMessage({ text: `Failed to ${editingId ? 'update' : 'create'} banner: ${error.message}`, type: 'error' });
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
          {editingId ? 'Edit Banner' : 'Add New Banner'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-body text-left">
            Banner Image
          </label>
          
          <div className="flex flex-col space-y-4">
            {/* File Upload Input */}
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <label htmlFor="bannerImageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                id="bannerImageUpload"
                accept="image/*"
                onChange={handleImageUpload}
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
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
                disabled={!!bannerImage}
              />
            </div>
          </div>
          
          {/* Image Preview */}
          {(imagePreview || formData.imageUrl) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <img 
                src={imagePreview || formData.imageUrl} 
                alt="Banner preview" 
                className="h-40 w-full object-cover rounded-md border border-gray-200" 
              />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-body text-left" htmlFor="order">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
            />
            <p className="text-xs text-gray-500 mt-1 font-body">
              Banners with lower order numbers will be displayed first
            </p>
          </div>
          
          <div className="flex items-center md:mt-8">
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
        
        <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  subtitle: '',
                  imageUrl: '',
                  isActive: true,
                  order: 0
                });
                setBannerImage(null);
                setImagePreview('');
                setEditingId(null);
                onEditComplete();
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
            {loading ? 'Saving...' : editingId ? 'Update Banner' : 'Add Banner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerManagement;