// frontend/src/pages/admin/AddBlog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, PlusCircle } from 'lucide-react';

const AddBlog = ({ editingBlog = null, onEditComplete = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [mustVisitThings, setMustVisitThings] = useState([
    { heading: '', description: '', image: null, preview: '', isNew: true }
  ]);
  const [editingId, setEditingId] = useState(null);

  // Set form data when editing blog is provided
  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || '',
        description: editingBlog.description || ''
      });
      
      if (editingBlog.backgroundImage?.data) {
        setBackgroundPreview(editingBlog.backgroundImage.data);
      }
      
      // Set up must visit things
      if (editingBlog.mustVisitThings && editingBlog.mustVisitThings.length > 0) {
        const formattedItems = editingBlog.mustVisitThings.map(item => ({
          id: item._id,
          heading: item.heading,
          description: item.description,
          preview: item.image?.data || '',
          isNew: false
        }));
        setMustVisitThings(formattedItems);
      } else {
        setMustVisitThings([
          { heading: '', description: '', image: null, preview: '', isNew: true }
        ]);
      }
      
      setEditingId(editingBlog._id);
    }
  }, [editingBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackgroundImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMustVisitChange = (index, field, value) => {
    const updatedItems = [...mustVisitThings];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setMustVisitThings(updatedItems);
  };

  const handleMustVisitImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const updatedItems = [...mustVisitThings];
      updatedItems[index] = {
        ...updatedItems[index],
        image: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0])
      };
      setMustVisitThings(updatedItems);
    }
  };

  const addMustVisitItem = () => {
    setMustVisitThings([
      ...mustVisitThings,
      { heading: '', description: '', image: null, preview: '', isNew: true }
    ]);
  };

  const removeMustVisitItem = (index) => {
    const updatedItems = [...mustVisitThings];
    updatedItems.splice(index, 1);
    setMustVisitThings(updatedItems);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: ''
    });
    setBackgroundImage(null);
    setBackgroundPreview('');
    setMustVisitThings([
      { heading: '', description: '', image: null, preview: '', isNew: true }
    ]);
    setEditingId(null);
    onEditComplete();
  };

  const prepareFormData = () => {
    const blogFormData = new FormData();
    
    // Add text fields
    blogFormData.append('title', formData.title);
    blogFormData.append('description', formData.description);
    
    // Add background image
    if (backgroundImage) {
      blogFormData.append('backgroundImage', backgroundImage);
    }
    
    // Prepare must visit things data
    const mustVisitData = mustVisitThings.map((item, index) => {
      const itemData = {
        heading: item.heading,
        description: item.description
      };
      
      // If we're editing and this is an existing item, include its ID
      if (item.id) {
        itemData.id = item.id;
      }
      
      return itemData;
    });
    
    blogFormData.append('mustVisitData', JSON.stringify(mustVisitData));
    
    // Add images for must visit things
    const imageMap = {};
    let imageIndex = 0;
    
    mustVisitThings.forEach((item, index) => {
      if (item.image) {
        if (item.id) {
          // This is an existing item, map its ID to the image index
          imageMap[item.id] = imageIndex;
        } else {
          // This is a new item, use a temporary ID
          imageMap[`new-${index}`] = imageIndex;
        }
        
        blogFormData.append('mustVisitImages', item.image);
        imageIndex++;
      }
    });
    
    // If we have an image map, add it
    if (Object.keys(imageMap).length > 0) {
      blogFormData.append('imageMap', JSON.stringify(imageMap));
    }
    
    return blogFormData;
  };

  const validateForm = () => {
    if (!formData.title || !formData.description) {
      setMessage({ text: 'Title and description are required', type: 'error' });
      return false;
    }
    
    if (!backgroundImage && !backgroundPreview) {
      setMessage({ text: 'Background image is required', type: 'error' });
      return false;
    }
    
    // Check if all must visit things have required fields
    for (let i = 0; i < mustVisitThings.length; i++) {
      const item = mustVisitThings[i];
      if (!item.heading || !item.description) {
        setMessage({ 
          text: `Must visit item #${i+1} is missing heading or description`, 
          type: 'error' 
        });
        return false;
      }
      
      if (!item.image && !item.preview) {
        setMessage({ 
          text: `Must visit item #${i+1} is missing an image`, 
          type: 'error' 
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const blogFormData = prepareFormData();
      
      if (editingId) {
        // Update blog
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/blogs/${editingId}`, 
          blogFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        setMessage({ text: 'Blog updated successfully!', type: 'success' });
      } else {
        // Create new blog
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/blogs`, 
          blogFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        setMessage({ text: 'Blog created successfully!', type: 'success' });
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      setMessage({ 
        text: `Failed to ${editingId ? 'update' : 'create'} blog: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
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
      
      {/* Blog Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-6 font-heading border-b pb-2 text-left">
          {editingId ? 'Edit Blog' : 'Add New Blog'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Background Image *
            </label>
            <div className="flex">
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
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
            
            {backgroundPreview && (
              <div className="mt-2 relative">
                <img
                  src={backgroundPreview}
                  alt="Background preview"
                  className="h-48 w-full object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Description *
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
          
          {/* Must Visit Things */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 font-body text-left">
                Must Visit Things *
              </label>
              <button
                type="button"
                onClick={addMustVisitItem}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-body flex items-center gap-1"
              >
                <PlusCircle size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {mustVisitThings.map((item, index) => (
                <div key={index} className="border p-4 rounded-md relative bg-gray-50">
                  {mustVisitThings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMustVisitItem(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                      title="Remove Item"
                    >
                      <X size={18} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Heading */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                        Heading *
                      </label>
                      <input
                        type="text"
                        value={item.heading}
                        onChange={(e) => handleMustVisitChange(index, 'heading', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                        Image *
                      </label>
                      <div className="flex">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMustVisitImageChange(index, e)}
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
                      {item.preview && (
                        <div className="mt-2">
                          <img
                            src={item.preview}
                            alt={`Item ${index + 1} preview`}
                            className="h-32 w-full object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                      Description *
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleMustVisitChange(index, 'description', e.target.value)}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-body"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-body flex items-center gap-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Saving...' : editingId ? 'Update Blog' : 'Add Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;