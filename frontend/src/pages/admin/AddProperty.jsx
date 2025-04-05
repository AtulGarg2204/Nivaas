import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Upload, PlusCircle, ChevronDown, ChevronUp, Star, Trash2, CheckCircle, XCircle, Edit, Plus, X } from 'lucide-react';

const AddProperty = ({ editingProperty = null, onEditComplete = () => {} }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    cityId: "",
    city: "",
    guests: 12,
    rooms: 5,
    baths: 5,
    beds: 6,
    description: "",
    price: 0,
    brochureLink:
      "https://drive.google.com/file/d/1CRrWSxoUMLi7sNe2-NAVNYBBLqogL_FZ/view?usp=sharing",
    video: "",
    mapLink: "https://www.google.com/maps",
  });

  // Dynamic amenities state
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "" });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [expandReviews, setExpandReviews] = useState(false);
  const [property, setProperty] = useState(null);
  
  // Review section state
  const [reviewFormData, setReviewFormData] = useState({
    userName: '',
    rating: 5,
    description: '',
    isActive: true
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Commonly used Font Awesome icon prefixes
  const commonIcons = [
    { name: "fa-tree", label: "Tree" },
    { name: "fa-pump-soap", label: "Soap" },
    { name: "fa-towel", label: "Towel" },
    { name: "fa-wifi", label: "WiFi" },
    { name: "fa-tv", label: "TV" },
    { name: "fa-washer", label: "Washer" },
    { name: "fa-tint", label: "Water" },
    { name: "fa-hot-tub", label: "Hot Tub" },
    { name: "fa-fire", label: "Fire" },
    { name: "fa-swimming-pool", label: "Pool" },
    { name: "fa-gamepad", label: "Game" },
    { name: "fa-fan", label: "Fan" },
    { name: "fa-air-conditioner", label: "AC" },
    { name: "fa-utensils", label: "Kitchen" },
    { name: "fa-parking", label: "Parking" },
  ];

  // Create a memoized fetchCities function
  const fetchCities = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cities`
      );
      setCities(res.data);

      // Set default city if cities are loaded and we're not editing
      if (res.data.length > 0 && !editingProperty) {
        setFormData((prev) => ({
          ...prev,
          cityId: res.data[0]._id,
          city: res.data[0].name,
        }));
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setMessage({ text: "Failed to fetch cities", type: "error" });
    }
  }, [editingProperty]);
  
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);
  
  // Set form data when editing property is provided
  useEffect(() => {
    if (editingProperty) {
      setFormData({
        name: editingProperty.name || "",
        cityId: editingProperty.cityId || "",
        city: editingProperty.city || "",
        guests: editingProperty.guests || 12,
        rooms: editingProperty.rooms || 5,
        baths: editingProperty.baths || 5,
        beds: editingProperty.beds || 6,
        description: editingProperty.description || "",
        price: editingProperty.price || 0,
        brochureLink: editingProperty.brochureLink || "https://drive.google.com/file/d/1CRrWSxoUMLi7sNe2-NAVNYBBLqogL_FZ/view?usp=sharing",
        video: editingProperty.video || "",
        mapLink: editingProperty.mapLink || "https://www.google.com/maps",
      });
      
      // Set amenities if available
      if (editingProperty.amenities && editingProperty.amenities.length > 0) {
        setAmenities(editingProperty.amenities);
      }
      
      setEditingId(editingProperty._id);
      setProperty(editingProperty);
      
      // If there are images, set their preview
      if (editingProperty.images && editingProperty.images.length > 0) {
        setPreviewImages(editingProperty.images.map(img => img.data));
      }
    }
  }, [editingProperty]);

  // Fetch property details if we have an ID (for reviews section)
  const fetchPropertyDetails = async () => {
    if (!editingId) return;
    
    try {
      setReviewsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/${editingId}`);
      setProperty(res.data);
      setAmenities(res.data.amenities || []);
      setReviewsLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (editingId && expandReviews) {
      fetchPropertyDetails();
    }
  }, [editingId, expandReviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If city selection changes, update both cityId and city name
    if (name === "cityId") {
      const selectedCity = cities.find((city) => city._id === value);
      setFormData((prev) => ({
        ...prev,
        cityId: value,
        city: selectedCity ? selectedCity.name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle new amenity input changes
  const handleNewAmenityChange = (e) => {
    const { name, value } = e.target;
    setNewAmenity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new amenity to the list
  const handleAddAmenity = () => {
    if (!newAmenity.name || !newAmenity.icon) {
      setMessage({ text: "Please provide both name and icon for the amenity", type: "error" });
      return;
    }

    // Add the new amenity
    setAmenities(prev => [...prev, { ...newAmenity }]);
    
    // Reset the form
    setNewAmenity({ name: "", icon: "" });
  };

  // Remove an amenity from the list
  const handleRemoveAmenity = (index) => {
    setAmenities(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0 && !editingId) {
      setMessage({ text: "Please upload at least one image", type: "error" });
      return;
    }

    if (!formData.cityId) {
      setMessage({ text: "Please select a city", type: "error" });
      return;
    }

    if (amenities.length === 0) {
      setMessage({ text: "Please add at least one amenity", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Create form data for submission
      const formDataToSubmit = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      // Add amenities
      formDataToSubmit.append("amenities", JSON.stringify(amenities));

      // Add images
      selectedImages.forEach((image) => {
        formDataToSubmit.append("images", image);
      });

      let response;
      
      // Submit the form data
      if (editingId) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/properties/${editingId}`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMessage({ text: "Property updated successfully!", type: "success" });
        setProperty(response.data);
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/properties`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMessage({ text: "Property created successfully! Now you can add reviews.", type: "success" });
        setEditingId(response.data._id);
        setProperty(response.data);
        setExpandReviews(true);
      }

    } catch (error) {
      console.error("Error saving property:", error);
      setMessage({
        text: `Failed to ${editingId ? "update" : "create"} property: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Review-related functions
  const handleReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewFormData(prev => ({ ...prev, rating }));
  };

  const handleEditReview = (review) => {
    setReviewFormData({
      userName: review.userName,
      rating: review.rating,
      description: review.description,
      isActive: review.isActive
    });
    setProfilePreview(review.profilePicture);
    setEditingReviewId(review._id);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      setReviewsLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/${editingId}/reviews/${reviewId}`);
      fetchPropertyDetails();
      setMessage({ text: 'Review deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessage({ text: 'Failed to delete review', type: 'error' });
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!profilePicture && !profilePreview && !editingReviewId) {
      setMessage({ text: 'Please upload a profile picture', type: 'error' });
      return;
    }
    
    setReviewsLoading(true);
    
    try {
      // Create form data for submission
      const formDataToSubmit = new FormData();
      
      // Add text fields
      Object.entries(reviewFormData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      
      // Add profile picture if available
      if (profilePicture) {
        formDataToSubmit.append('profilePicture', profilePicture);
      } else if (profilePreview && !profilePicture && editingReviewId) {
        // If editing and using existing profile picture, send it as is
        formDataToSubmit.append('profilePicture', profilePreview);
      }
      
      // Submit the form data
      if (editingReviewId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/properties/${editingId}/reviews/${editingReviewId}`, 
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
          `${process.env.REACT_APP_API_URL}/api/properties/${editingId}/reviews`, 
          formDataToSubmit,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setMessage({ text: 'Review added successfully!', type: 'success' });
      }
      
      // Reset form
      setReviewFormData({
        userName: '',
        rating: 5,
        description: '',
        isActive: true
      });
      setProfilePicture(null);
      setProfilePreview('');
      setEditingReviewId(null);
      
      // Refresh property data
      fetchPropertyDetails();
      
    } catch (error) {
      console.error('Error saving review:', error);
      setMessage({ 
        text: `Failed to save review: ${error.response?.data?.message || error.message}`, 
        type: 'error' 
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      cityId: cities.length > 0 ? cities[0]._id : "",
      city: cities.length > 0 ? cities[0].name : "",
      guests: 12,
      rooms: 5,
      baths: 5,
      beds: 6,
      description: "",
      price: 0,
      brochureLink:
        "https://drive.google.com/file/d/1CRrWSxoUMLi7sNe2-NAVNYBBLqogL_FZ/view?usp=sharing",
      video: "",
      mapLink: "https://www.google.com/maps",
    });
    setSelectedImages([]);
    setPreviewImages([]);
    setAmenities([]);
    setNewAmenity({ name: "", icon: "" });
    setEditingId(null);
    setExpandReviews(false);
    setProperty(null);
    
    // Reset review form
    setReviewFormData({
      userName: '',
      rating: 5,
      description: '',
      isActive: true
    });
    setProfilePicture(null);
    setProfilePreview('');
    setEditingReviewId(null);
    
    // Notify parent component that editing is complete
    onEditComplete();
  };

  return (
    <div>
      {/* Message display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded font-body ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Property Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-xl font-bold mb-6 font-heading border-b pb-2 text-left">
          {editingId ? "Edit Property" : "Add New Property"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                City *
              </label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Price per night (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Maximum Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Number of Rooms
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Number of Bathrooms
              </label>
              <input
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Beds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Number of Beds
              </label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Brochure Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Brochure Link
              </label>
              <input
                type="text"
                name="brochureLink"
                value={formData.brochureLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Video URL (YouTube or direct link)
              </label>
              <input
                type="text"
                name="video"
                value={formData.video}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            {/* Map Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                Map Link (Google Maps)
              </label>
              <input
                type="text"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://goo.gl/maps/example"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Property Description *
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

          {/* Amenities Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Amenities *
            </label>
            
            {/* Add New Amenity Form */}
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h4 className="text-md font-medium mb-3 text-left">Add New Amenity</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Amenity Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAmenity.name}
                    onChange={handleNewAmenityChange}
                    placeholder="e.g. Swimming Pool"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Amenity Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                    Icon (Font Awesome)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={newAmenity.icon}
                    onChange={handleNewAmenityChange}
                    placeholder="e.g. fa-swimming-pool"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Add Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-body flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Amenity
                  </button>
                </div>
              </div>
              
              {/* Common Icons Helper */}
              <div className="mt-3">
                <h5 className="text-sm font-medium mb-2 text-left">Common Icons:</h5>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNewAmenity(prev => ({ ...prev, icon: icon.name }))}
                      className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                    >
                      <i className={`fas ${icon.name} mr-1`}></i>
                      {icon.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Current Amenities List */}
            <div>
              <h4 className="text-md font-medium mb-3 text-left">Current Amenities</h4>
              
              {amenities.length === 0 ? (
                <div className="text-gray-500 italic text-left">No amenities added yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded bg-white">
                      <div className="flex items-center">
                        <i className={`fas ${amenity.icon} mr-2 text-blue-600`}></i>
                        <span>{amenity.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove Amenity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
              Property Images {!editingId && '*'}
            </label>
            <div className="flex">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required={!editingId}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-r-md border border-l-0 border-gray-300"
                title="Upload Images"
              >
                <Upload size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
            {editingId && (
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md mr-3 font-body"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white font-body flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <PlusCircle size={18} />
              {loading ? "Saving..." : editingId ? "Update Property" : "Create Property"}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Section - Only show if property has been created/is being edited */}
      {editingId && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => { 
              setExpandReviews(!expandReviews);
              if (!expandReviews && !property) {
                fetchPropertyDetails();
              }
            }}
          >
            <h3 className="text-xl font-bold font-heading">
              Property Reviews
            </h3>
            {expandReviews ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>

          {expandReviews && (
            <div className="mt-6">
              {/* Review Form */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="text-lg font-semibold mb-4 font-heading text-left">
                  {editingReviewId ? 'Edit Review' : 'Add New Review'}
                </h4>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                        User Name *
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={reviewFormData.userName}
                        onChange={handleReviewChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                                star <= reviewFormData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Profile Picture */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 font-body text-left">
                        Profile Picture {!editingReviewId && '*'}
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={reviewFormData.isActive}
                        onChange={handleReviewChange}
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
                      value={reviewFormData.description}
                      onChange={handleReviewChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md font-body focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewFormData({
                            userName: '',
                            rating: 5,
                            description: '',
                            isActive: true
                          });
                          setProfilePicture(null);
                          setProfilePreview('');
                          setEditingReviewId(null);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-3 font-body text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={reviewsLoading}
                      className={`px-4 py-2 rounded-md text-white font-body text-sm ${
                        reviewsLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {reviewsLoading ? 'Saving...' : editingReviewId ? 'Update Review' : 'Add Review'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Existing Reviews List */}
              {property && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 font-heading text-left border-b pb-2">
                    Existing Reviews ({property.reviews?.length || 0})
                  </h4>
                  
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : !property.reviews || property.reviews.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No reviews yet. Add a review using the form above.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {property.reviews.map((review) => (
                        <div key={review._id} className={`p-4 rounded-lg border ${review.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}>
                          <div className="flex justify-between">
                            <div className="flex items-start space-x-4">
                              <img 
                                src={review.profilePicture} 
                                alt={review.userName}
                                className="h-12 w-12 rounded-full object-cover border border-gray-200" 
                              />
                              <div>
                                <div className="flex items-center">
                                  <h5 className="font-semibold text-gray-900">{review.userName}</h5>
                                  <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                                    review.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {review.isActive ? (
                                      <span className="flex items-center">
                                        <CheckCircle size={12} className="mr-1" /> Active
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <XCircle size={12} className="mr-1" /> Inactive
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-2 text-gray-700">{review.description}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit Review"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete Review"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddProperty;