import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit, Trash2, Search, RefreshCw, CheckCircle, XCircle, Home } from 'lucide-react';

const ViewCities = ({ onEditCity }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [expandedCity, setExpandedCity] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
      setCities(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('Failed to fetch cities');
      setLoading(false);
    }
  };

  const handleEdit = (cityId) => {
    // Find the city from our state
    const cityToEdit = cities.find(city => city._id === cityId);
    
    if (cityToEdit && onEditCity) {
      // Pass the entire city object to the parent component
      onEditCity(cityToEdit);
    } else {
      console.error('City not found or onEditCity prop is not provided');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/cities/${id}`);
        fetchCities();
      } catch (error) {
        console.error('Error deleting city:', error);
        setError('Failed to delete city');
        setLoading(false);
      }
    }
  };

  const toggleExpand = (cityId) => {
    setExpandedCity(expandedCity === cityId ? null : cityId);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCities = [...cities].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredCities = sortedCities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-700 border border-red-300 font-body">
          {error}
          <button 
            onClick={fetchCities} 
            className="ml-2 text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={fetchCities}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-body transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center font-body">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full mb-2"></div>
            <p>Loading cities...</p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-body">
            <p>No cities found {searchTerm && `matching "${searchTerm}"`}</p>
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
                      City Name
                      {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Things to Do
                  </th>
                  <th 
                    onClick={() => handleSort('isActive')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === 'isActive' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('showOnHome')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Home Page
                      {sortConfig.key === 'showOnHome' && (
                        <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCities.map((city) => (
                  <React.Fragment key={city._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-body">{city.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={city.image} alt={city.name} className="h-12 w-20 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 font-body">
                            {city.thingsToDo ? city.thingsToDo.length : 0} items
                          </span>
                          {city.thingsToDo && city.thingsToDo.length > 0 && (
                            <button
                              onClick={() => toggleExpand(city._id)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              title="View things to do"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                          city.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {city.isActive ? (
                            <><CheckCircle size={14} className="mr-1" /> Active</>
                          ) : (
                            <><XCircle size={14} className="mr-1" /> Inactive</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                          city.showOnHome 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-[#13130F]'
                        }`}>
                          {city.showOnHome ? (
                            <><Home size={14} className="mr-1" /> Show</>
                          ) : (
                            <><XCircle size={14} className="mr-1" /> Hidden</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(city._id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(city._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedCity === city._id && city.thingsToDo && city.thingsToDo.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="text-sm font-bold mb-2 font-heading">Things to Do in {city.name}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {city.thingsToDo.map((thing, index) => (
                              <div key={index} className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                <div className="flex">
                                  <div className="flex-shrink-0 mr-3">
                                    <img 
                                      src={thing.image} 
                                      alt={thing.heading} 
                                      className="h-16 w-16 object-cover rounded" 
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 font-heading">{thing.heading}</div>
                                    <div className="text-xs text-gray-500 font-body line-clamp-2">{thing.description}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCities;