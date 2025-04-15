// frontend/src/pages/admin/ViewProperties.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Eye, 
  MapPin,
  Users,
  Home,
  BedDouble,
  Bath,
  Star,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

const ViewProperties = ({ onEditProperty = () => {} }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [modalData, setModalData] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
      setCities(res.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
      setProperties(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to fetch properties');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/${id}`);
        setProperties(properties.filter(property => property._id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error deleting property:', error);
        setError('Failed to delete property');
        setLoading(false);
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePreview = (property) => {
    setModalData(property);
  };

  const sortedProperties = [...properties].sort((a, b) => {
    // Handle nested properties like rating.average
    if (sortConfig.key === 'rating') {
      const aValue = a.rating?.average || 0;
      const bValue = b.rating?.average || 0;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    
    // Normal sorting for other properties
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredProperties = sortedProperties.filter(property => {
    const matchesSearch = 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === '' || property.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-700 border border-red-300 font-body">
          {error}
          <button 
            onClick={fetchProperties} 
            className="ml-2 text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchProperties}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-body transition-colors w-full md:w-auto justify-center"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center font-body">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full mb-2"></div>
            <p>Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-body">
            <p>No properties found {searchTerm && `matching "${searchTerm}"`}{cityFilter && ` in ${cityFilter}`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Property
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('city')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      City
                      {sortConfig.key === 'city' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Price
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('rating')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Rating
                      {sortConfig.key === 'rating' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('guests')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Capacity
                      {sortConfig.key === 'guests' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={property.images && property.images[0]?.data}
                            alt={property.name}
                            onError={(e) => { 
                              e.target.src = "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-body">{property.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-body flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-500" />
                        {property.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-body">
                        ₹{property.price}/night
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-body flex items-center">
                        <Star size={14} className="mr-1 text-yellow-500" />
                        {property.rating?.average ? property.rating.average.toFixed(1) : 'N/A'} 
                        <span className="text-gray-500 ml-1">
                          ({property.rating?.count || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-body">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          {property.guests || 0}
                        </div>
                        <div className="flex items-center">
                          <Home size={14} className="mr-1" />
                          {property.rooms || 0}
                        </div>
                        <div className="flex items-center">
                          <BedDouble size={14} className="mr-1" />
                          {property.beds || 0}
                        </div>
                        <div className="flex items-center">
                          <Bath size={14} className="mr-1" />
                          {property.baths || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handlePreview(property)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditProperty(property)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Preview Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-heading">{modalData.name}</h3>
              <button 
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {/* Property Images */}
              {modalData.images && modalData.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {modalData.images.slice(0, 6).map((image, index) => (
                    <div key={index} className={index === 0 ? "md:col-span-2 row-span-2" : ""}>
                      <img 
                        src={image.data} 
                        alt={`${modalData.name} - ${index + 1}`} 
                        className="w-full h-48 object-cover rounded-md border border-gray-200" 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Property Details */}
                <div>
                  <h4 className="font-heading font-bold text-lg mb-2">Property Details</h4>
                  <div className="space-y-2">
                    <p className="font-body flex items-center">
                      <MapPin size={18} className="mr-2 text-gray-500" /> 
                      {modalData.city}
                    </p>
                    <p className="font-body flex items-center">
                      <Users size={18} className="mr-2 text-gray-500" />
                      {modalData.guests} guests
                    </p>
                    <p className="font-body flex items-center">
                      <Home size={18} className="mr-2 text-gray-500" />
                      {modalData.rooms} rooms
                    </p>
                    <p className="font-body flex items-center">
                      <BedDouble size={18} className="mr-2 text-gray-500" />
                      {modalData.beds} beds
                    </p>
                    <p className="font-body flex items-center">
                      <Bath size={18} className="mr-2 text-gray-500" />
                      {modalData.baths} bathrooms
                    </p>
                    <p className="font-body font-bold text-lg">
                      ₹{modalData.price}/night
                    </p>
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h4 className="font-heading font-bold text-lg mb-2">Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {modalData.amenities && modalData.amenities.length > 0 ? (
                      modalData.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center font-body bg-gray-50 rounded-md p-2">
                          {/* Display custom icon image if available */}
                          {amenity.icon && (
                            <div className="h-6 w-6 mr-2 overflow-hidden">
                              <img 
                                src={amenity.icon} 
                                alt={amenity.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          )}
                          <span className="text-sm">{amenity.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 font-body col-span-2">No amenities listed</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h4 className="font-heading font-bold text-lg mb-2">Description</h4>
                <p className="font-body text-gray-700 whitespace-pre-line">{modalData.description}</p>
              </div>
              
              {/* External Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {modalData.brochureLink && (
                  <a 
                    href={modalData.brochureLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-body flex items-center justify-center hover:bg-blue-200"
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    View Brochure
                  </a>
                )}
                {modalData.mapLink && (
                  <a 
                    href={modalData.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-md font-body flex items-center justify-center hover:bg-green-200"
                  >
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    View on Map
                  </a>
                )}
                {modalData.video && (
                  <a 
                    href={modalData.video} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md font-body flex items-center justify-center hover:bg-red-200"
                  >
                    <i className="fas fa-video mr-2"></i>
                    Watch Video
                  </a>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setModalData(null)} 
                className="px-4 py-2 bg-gray-200 text-[#13130F] rounded-md font-body hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProperties;