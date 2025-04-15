import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, ChevronDown, CheckSquare, Square } from 'lucide-react';
// Import CKEditor components - the modern way
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Paragraph, Bold, Italic, Essentials, Heading, Image, ImageUpload, Link, MediaEmbed, BlockQuote, Table } from 'ckeditor5';

// Import the required CSS
import 'ckeditor5/ckeditor5.css';

const AddBlog = ({ editingBlog = null, onEditComplete = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    blogImageDescription: '',
    isActive: true,
    cityId: '',
    cityName: '',
    otherCityName: '',
    editorContent: '' // For CKEditor content
  });
  
  // Images
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState('');
  
  // Cities and "Things to do"
  const [cities, setCities] = useState([]);
  const [allThingsToDo, setAllThingsToDo] = useState([]);
  const [selectedThingsToDo, setSelectedThingsToDo] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cityFilter, setCityFilter] = useState('all');

  // Fetch cities and their "Things to Do" on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Set form data when editing blog is provided
  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || '',
        description: editingBlog.description || '',
        blogImageDescription: editingBlog.blogImageDescription || '',
        isActive: editingBlog.isActive !== undefined ? editingBlog.isActive : true,
        cityId: editingBlog.city?.cityId || '',
        cityName: editingBlog.city?.cityName || '',
        otherCityName: editingBlog.city?.cityId === 'other' ? editingBlog.city.cityName : '',
        editorContent: editingBlog.editorContent || ''
      });
      
      // Set background image preview if available
      if (editingBlog.backgroundImage?.data) {
        setBackgroundPreview(editingBlog.backgroundImage.data);
      }
      
      // Set blog image preview if available
      if (editingBlog.blogImage?.data) {
        setBlogImagePreview(editingBlog.blogImage.data);
      }
      
      // Set selected things to do from existing blog
      if (editingBlog.mustVisitThingsData && editingBlog.mustVisitThingsData.length > 0) {
        setSelectedThingsToDo(editingBlog.mustVisitThingsData);
      }
      
      setEditingId(editingBlog._id);
    }
  }, [editingBlog]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
      setCities(res.data.filter(city => city.isActive)); // Only active cities
      
      // Extract all "things to do" from cities with their city info
      const allThings = res.data.flatMap(city => 
        (city.thingsToDo || []).map(thing => ({
          thingId: thing._id,
          cityId: city._id,
          cityName: city.name,
          heading: thing.heading,
          description: thing.description,
          image: thing.image
        }))
      );
      
      setAllThingsToDo(allThings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setMessage({ text: 'Failed to fetch cities and things to do', type: 'error' });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // When city changes, update cityName accordingly
    if (name === 'cityId') {
      if (value === 'other') {
        // If "Other" is selected, keep the cityName empty to be filled by otherCityName
        setFormData(prev => ({
          ...prev,
          cityId: value,
          cityName: ''
        }));
      } else if (value) {
        // If a city is selected, find its name and update cityName
        const selectedCity = cities.find(city => city._id === value);
        if (selectedCity) {
          setFormData(prev => ({
            ...prev,
            cityId: value,
            cityName: selectedCity.name
          }));
        }
      } else {
        // If no city is selected, clear cityName
        setFormData(prev => ({
          ...prev,
          cityId: '',
          cityName: ''
        }));
      }
    }
  };

  // Handle CKEditor content change
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({
      ...prev,
      editorContent: data
    }));
  };

  const handleBackgroundImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
      setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBlogImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBlogImage(e.target.files[0]);
      setBlogImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleThingToDoSelection = (thing) => {
    const isSelected = selectedThingsToDo.some(item => item.thingId === thing.thingId);
    
    if (isSelected) {
      // Remove from selection
      setSelectedThingsToDo(selectedThingsToDo.filter(item => item.thingId !== thing.thingId));
    } else {
      // Add to selection
      setSelectedThingsToDo([...selectedThingsToDo, thing]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      blogImageDescription: '',
      isActive: true,
      cityId: '',
      cityName: '',
      otherCityName: '',
      editorContent: ''
    });
    setBackgroundImage(null);
    setBackgroundPreview('');
    setBlogImage(null);
    setBlogImagePreview('');
    setSelectedThingsToDo([]);
    setEditingId(null);
    onEditComplete();
  };

  const prepareFormData = () => {
    const blogFormData = new FormData();
    
    // Add text fields
    blogFormData.append('title', formData.title);
    blogFormData.append('description', formData.description);
    blogFormData.append('blogImageDescription', formData.blogImageDescription);
    blogFormData.append('isActive', formData.isActive);
    blogFormData.append('editorContent', formData.editorContent);
    
    // Add city information
    blogFormData.append('cityId', formData.cityId);
    
    // If "Other" is selected, use the otherCityName as cityName
    const cityName = formData.cityId === 'other' ? formData.otherCityName : formData.cityName;
    blogFormData.append('cityName', cityName);
    
    // Add background image
    if (backgroundImage) {
      blogFormData.append('backgroundImage', backgroundImage);
    }
    
    // Add blog image
    if (blogImage) {
      blogFormData.append('blogImage', blogImage);
    }
    
    // Prepare things to do data - we only need the IDs for reference
    const thingIds = selectedThingsToDo.map(thing => thing.thingId);
    blogFormData.append('thingsToDo', JSON.stringify(thingIds));
    
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
    
    if (!blogImage && !blogImagePreview) {
      setMessage({ text: 'Blog image is required', type: 'error' });
      return false;
    }
    
    if (!formData.blogImageDescription) {
      setMessage({ text: 'Blog image description is required', type: 'error' });
      return false;
    }
    
    // Validate city selection
    if (formData.cityId === 'other' && !formData.otherCityName.trim()) {
      setMessage({ text: 'Please enter a city name for "Other" option', type: 'error' });
      return false;
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

  // Filter things to do by city
  const filteredThingsToDo = allThingsToDo.filter(thing => 
    cityFilter === 'all' || thing.cityId === cityFilter
  );

  // Configure image upload adapter for CKEditor
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }
  
    upload() {
      return this.loader.file
        .then(file => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('upload', file);
  
            axios.post(`${process.env.REACT_APP_API_URL}/api/upload/ckeditor-image`, formData)
              .then(response => {
                // Add a small delay to let the editor stabilize
                setTimeout(() => {
                  resolve({
                    default: response.data.url
                  });
                }, 100);
              })
              .catch(error => {
                reject(error);
              });
          });
        });
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

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
          
          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              City
            </label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            >
              <option value="">Select a City (Optional)</option>
              {cities.map(city => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            
            {/* Show this field only when "Other" is selected */}
            {formData.cityId === 'other' && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                  Other City Name *
                </label>
                <input
                  type="text"
                  name="otherCityName"
                  value={formData.otherCityName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter city name"
                />
              </div>
            )}
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

          {/* CKEditor Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Blog Content (Rich Text)
            </label>
            <div className="border border-gray-300 rounded-md">
              <CKEditor
                editor={ClassicEditor}
                data={formData.editorContent}
                onChange={handleEditorChange}
                config={{
                  licenseKey: 'GPL',
                  plugins: [
                    Essentials, Paragraph, Bold, Italic, Heading,
                    Image, ImageUpload, Link, MediaEmbed, BlockQuote, Table
                  ],
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'link', '|',
                    'bulletedList', 'numberedList', '|',
                    'imageUpload', 'blockQuote', 'insertTable', '|',
                    'undo', 'redo'
                  ],
                  extraPlugins: [MyCustomUploadAdapterPlugin]
                }}
                onReady={editor => {
                  console.log('Editor is ready to use!', editor);
                }}
                onError={(error, { willEditorRestart }) => {
                  console.error('CKEditor error:', error);
                  if (willEditorRestart) {
                    console.log('Editor will be restarted');
                  }
                }}
              />
            </div>
          </div>
          
          {/* Blog Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Blog Image *
            </label>
            <div className="flex">
              <input
                type="file"
                accept="image/*"
                onChange={handleBlogImageChange}
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
            
            {blogImagePreview && (
              <div className="mt-2 relative">
                <img
                  src={blogImagePreview}
                  alt="Blog preview"
                  className="h-48 w-full object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
          
          {/* Blog Image Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Blog Image Description *
            </label>
            <textarea
              name="blogImageDescription"
              value={formData.blogImageDescription}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          {/* Things to Do selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Select Things to Do from Cities
            </label>
            
            {/* City filter dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1 font-body text-left">
                Filter by City:
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city._id} value={city._id}>
                    {city.name} ({(city.thingsToDo || []).length} things)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Selection dropdown */}
            <div className="relative">
              <div
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body flex justify-between items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className={selectedThingsToDo.length === 0 ? "text-gray-500" : "text-gray-900"}>
                  {selectedThingsToDo.length === 0 
                    ? "Select things to do" 
                    : `${selectedThingsToDo.length} thing(s) selected`}
                </span>
                <ChevronDown size={20} className={`transition-transform ${showDropdown ? "transform rotate-180" : ""}`} />
              </div>
              
              {/* Dropdown content */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredThingsToDo.length === 0 ? (
                    <div className="p-3 text-gray-500 text-center font-body">
                      No things to do found
                    </div>
                  ) : (
                    filteredThingsToDo.map(thing => {
                      const isSelected = selectedThingsToDo.some(item => item.thingId === thing.thingId);
                      return (
                        <div
                          key={thing.thingId}
                          className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer flex items-start ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                          onClick={() => toggleThingToDoSelection(thing)}
                        >
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {isSelected ? (
                              <CheckSquare size={18} className="text-blue-600" />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              {thing.image?.data && (
                                <img
                                  src={thing.image.data}
                                  alt={thing.heading}
                                  className="h-8 w-8 object-cover rounded-md"
                                />
                              )}
                              <div>
                                <div className="font-medium text-sm">{thing.heading}</div>
                                <div className="text-xs text-gray-500">{thing.cityName}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
            
            {/* Selected things preview */}
            {selectedThingsToDo.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-500 mb-2 font-body text-left">
                  Selected Things to Do:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedThingsToDo.map(thing => (
                    <div key={thing.thingId} className="border rounded-md p-2 bg-gray-50 flex items-center gap-2 group">
                      {thing.image?.data && (
                        <img
                          src={thing.image.data}
                          alt={thing.heading}
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-medium truncate">{thing.heading}</div>
                        <div className="text-xs text-gray-500">{thing.cityName}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleThingToDoSelection(thing)}
                        className="ml-auto text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 font-body text-left">
              Active (visible on site)
            </label>
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-300 text-[#13130F] rounded-md hover:bg-gray-400 transition-colors font-body"
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