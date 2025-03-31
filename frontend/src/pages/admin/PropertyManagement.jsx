// frontend/src/pages/admin/PropertyManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";

// Icons for amenities
const amenityIcons = {
  Lawn: "fa-tree",
  "Shower Gel & Shampoo": "fa-pump-soap",
  Towels: "fa-towel",
  Wifi: "fa-wifi",
  TV: "fa-tv",
  "Washing Machine": "fa-washer",
  "Water Purifier": "fa-tint",
  Geysers: "fa-hot-tub",
  Heaters: "fa-fire",
};

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
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

  const [selectedAmenities, setSelectedAmenities] = useState([
    "Lawn",
    "Shower Gel & Shampoo",
    "Towels",
    "Wifi",
    "TV",
    "Washing Machine",
    "Water Purifier",
    "Geysers",
    "Heaters",
  ]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // List of all possible amenities
  const allAmenities = Object.keys(amenityIcons);

  useEffect(() => {
    fetchCities();
    fetchProperties();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cities`
      );
      setCities(res.data);

      // Set default city if cities are loaded
      if (res.data.length > 0) {
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
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/properties`
      );
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setMessage({ text: "Failed to fetch properties", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities((prev) => [...prev, amenity]);
    }
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

    if (selectedImages.length === 0) {
      setMessage({ text: "Please upload at least one image", type: "error" });
      return;
    }

    if (!formData.cityId) {
      setMessage({ text: "Please select a city", type: "error" });
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

      // Add amenities with icons
      const amenitiesWithIcons = selectedAmenities.map((name) => ({
        name,
        icon: amenityIcons[name],
      }));
      formDataToSubmit.append("amenities", JSON.stringify(amenitiesWithIcons));

      // Add images
      selectedImages.forEach((image) => {
        formDataToSubmit.append("images", image);
      });

      // Submit the form data
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/properties`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({ text: "Property created successfully!", type: "success" });

      // Reset form
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
      setSelectedAmenities([
        "Lawn",
        "Shower Gel & Shampoo",
        "Towels",
        "Wifi",
        "TV",
        "Washing Machine",
        "Water Purifier",
        "Geysers",
        "Heaters",
      ]);

      // Refresh properties list
      fetchProperties();
    } catch (error) {
      console.error("Error creating property:", error);
      setMessage({
        text: `Failed to create property: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 font-poppins text-left">
        Property Management
      </h2>

      {/* Message display */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded font-poppins ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Property Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-12">
        <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2 text-left">
          Add New Property
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                City *
              </label>
              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Price per night (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Maximum Guests
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Number of Rooms
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Number of Bathrooms
              </label>
              <input
                type="number"
                name="baths"
                value={formData.baths}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Beds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Number of Beds
              </label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Brochure Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Brochure Link
              </label>
              <input
                type="text"
                name="brochureLink"
                value={formData.brochureLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Video URL (YouTube or direct link)
              </label>
              <input
                type="text"
                name="video"
                value={formData.video}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            {/* Map Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
                Map Link (Google Maps)
              </label>
              <input
                type="text"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://goo.gl/maps/example"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
              Property Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins text-left">
              Amenities
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="ml-2 text-sm text-gray-700 font-poppins"
                  >
                    <i className={`fas ${amenityIcons[amenity]} mr-2`}></i>
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins text-left">
              Property Images *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md font-poppins focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

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
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-md text-white font-poppins ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Property"}
            </button>
          </div>
        </form>
      </div>

      {/* Properties List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 font-poppins border-b pb-2 text-left">
          Existing Properties
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins"
                  >
                    City
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-poppins"
                  >
                    Capacity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={property.images[0]?.data}
                            alt={property.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-poppins">
                            {property.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-poppins">
                        {property.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-poppins">
                        ₹{property.price}/night
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-poppins">
                        {property.rating?.average.toFixed(1)} (
                        {property.rating?.count})
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-poppins">
                      {property.guests} guests · {property.rooms} rooms ·{" "}
                      {property.beds} beds
                    </td>
                  </tr>
                ))}

                {properties.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500 font-poppins"
                    >
                      No properties found. Create your first property!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManagement;