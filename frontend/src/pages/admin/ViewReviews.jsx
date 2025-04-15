import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Star, 
  CheckCircle, 
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  MessageSquare
} from 'lucide-react';

const ViewReviews = ({ onEditReview = () => {} }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'userName', direction: 'ascending' });
  const [modalData, setModalData] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews`);
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`);
        setReviews(reviews.filter(review => review._id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review');
        setLoading(false);
      }
    }
  };

  const toggleReviewStatus = async (review) => {
    try {
      const updatedIsActive = !review.isActive;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/reviews/${review._id}/toggle-status`, {
        isActive: updatedIsActive
      });
      
      // Update the reviews state
      setReviews(reviews.map(r => 
        r._id === review._id ? { ...r, isActive: updatedIsActive } : r
      ));
    } catch (error) {
      console.error('Error toggling review status:', error);
      setError('Failed to update review status');
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = (review) => {
    setModalData(review);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    // Handle special case for rating
    if (sortConfig.key === 'rating') {
      if (a.rating < b.rating) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.rating > b.rating) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    
    // Handle special case for isActive
    if (sortConfig.key === 'isActive') {
      if (a.isActive === b.isActive) return 0;
      if (sortConfig.direction === 'ascending') {
        return a.isActive ? -1 : 1;
      } else {
        return a.isActive ? 1 : -1;
      }
    }
    
    // Standard string/number sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredReviews = sortedReviews.filter(review => {
    const matchesSearch = 
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      review.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.referenceApp?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === '' || review.city === cityFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && review.isActive) || 
      (statusFilter === 'inactive' && !review.isActive);
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-700 border border-red-300 font-body">
          {error}
          <button 
            onClick={fetchReviews} 
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
              placeholder="Search reviews..."
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
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <button
          onClick={fetchReviews}
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
            <p>Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-body">
            <p>No reviews found {searchTerm && `matching "${searchTerm}"`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('userName')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      User
                      {sortConfig.key === 'userName' && (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Source
                  </th>
                  <th 
                    onClick={() => handleSort('isActive')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === 'isActive' && (
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
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                            src={review.profilePicture} 
                            alt={review.userName}
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=User"; }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-body">{review.userName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-body">{review.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(review.rating)}
                      <div className="text-xs text-gray-500 font-body mt-1">{review.rating}/5</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-body truncate max-w-xs">
                        {review.description}
                        {review.description && review.description.length > 50 && (
                          <button 
                            onClick={() => handleViewDetails(review)}
                            className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.referenceApp?.logo ? (
                        <div className="flex items-center">
                          <img 
                            src={review.referenceApp.logo} 
                            alt={review.referenceApp.name || "Reference app"} 
                            className="h-6 w-6 object-contain"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/24?text=App"; }}
                          />
                          {review.referenceApp.name && (
                            <span className="ml-2 text-sm text-gray-700">{review.referenceApp.name}</span>
                          )}
                        </div>
                      ) : review.referenceApp?.name ? (
                        <span className="text-sm text-gray-700">{review.referenceApp.name}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleReviewStatus(review)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                          review.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {review.isActive ? (
                          <><CheckCircle size={14} className="mr-1" /> Active</>
                        ) : (
                          <><XCircle size={14} className="mr-1" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditReview(review)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
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

      {/* Review Details Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-heading">Review Details</h3>
              <button 
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="flex mb-4 sm:mb-0">
                  <img 
                    src={modalData.profilePicture} 
                    alt={modalData.userName}
                    className="h-16 w-16 rounded-full object-cover border border-gray-200 mr-4"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=User"; }}
                  />
                  <div>
                    <h4 className="text-lg font-bold font-heading">{modalData.userName}</h4>
                    <p className="text-gray-600 font-body">{modalData.city}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(modalData.rating)}
                      <span className="ml-2 text-gray-700 font-body">{modalData.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                {(modalData.referenceApp?.logo || modalData.referenceApp?.name) && (
                  <div className="flex items-center ml-auto bg-gray-50 px-4 py-2 rounded-md">
                    {modalData.referenceApp?.logo && (
                      <img 
                        src={modalData.referenceApp.logo} 
                        alt={modalData.referenceApp.name || "Reference app"} 
                        className="h-10 w-10 object-contain mr-2"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=App"; }}
                      />
                    )}
                    {modalData.referenceApp?.name && (
                      <span className="text-gray-700 font-medium">{modalData.referenceApp.name}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-start">
                  <MessageSquare size={20} className="text-gray-500 mr-2 mt-1" />
                  <div>
                    <h5 className="font-heading font-bold mb-2">Review</h5>
                    <p className="text-gray-700 font-body whitespace-pre-line">{modalData.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 font-body mb-1">Status</p>
                  <p className={`font-medium font-body flex items-center ${
                    modalData.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {modalData.isActive ? (
                      <><CheckCircle size={16} className="mr-1" /> Active</>
                    ) : (
                      <><XCircle size={16} className="mr-1" /> Inactive</>
                    )}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 font-body mb-1">Created</p>
                  <p className="font-medium font-body">
                    {modalData.createdAt ? new Date(modalData.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => onEditReview(modalData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-body hover:bg-blue-700 mr-2"
              >
                Edit Review
              </button>
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
export default ViewReviews;