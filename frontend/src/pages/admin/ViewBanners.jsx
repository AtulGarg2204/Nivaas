// frontend/src/pages/admin/ViewBanners.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ArrowUp, 
  ArrowDown,
  Eye,
  X,
  Monitor,
  Smartphone,
  Layers
} from 'lucide-react';

const ViewBanners = ({ onEditBanner = () => {} }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'order', direction: 'ascending' });
  const [modalData, setModalData] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/banners`);
      setBanners(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to fetch banners');
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    // Pass the banner to the parent component
    onEditBanner(banner);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        setError('Failed to delete banner');
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

  const handlePreview = (banner) => {
    setModalData(banner);
  };

  const getBannerTypeIcon = (type) => {
    switch (type) {
      case 'desktop':
        return <Monitor size={16} className="mr-1" />;
      case 'mobile':
        return <Smartphone size={16} className="mr-1" />;
      case 'both':
        return <Layers size={16} className="mr-1" />;
      default:
        return <Monitor size={16} className="mr-1" />;
    }
  };

  const getBannerTypeLabel = (type) => {
    switch (type) {
      case 'desktop':
        return 'Desktop';
      case 'mobile':
        return 'Mobile';
      case 'both':
        return 'Both';
      default:
        return 'Desktop';
    }
  };

  const getBannerTypeClass = (type) => {
    switch (type) {
      case 'desktop':
        return 'bg-blue-100 text-blue-800';
      case 'mobile':
        return 'bg-purple-100 text-purple-800';
      case 'both':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Sort banners
  const sortedBanners = [...banners].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter banners by type and search term
  const filteredBanners = sortedBanners.filter(banner => {
    const matchesSearch = 
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && banner.bannerType === filterType;
    }
  });

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-700 border border-red-300 font-body">
          {error}
          <button 
            onClick={fetchBanners} 
            className="ml-2 text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
            >
              <option value="all">All Banners</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
              <option value="both">Both Devices</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchBanners}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-body transition-colors whitespace-nowrap"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center font-body">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full mb-2"></div>
            <p>Loading banners...</p>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-body">
            <p>No banners found {searchTerm && `matching "${searchTerm}"`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('title')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Title
                      {sortConfig.key === 'title' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Subtitle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body">
                    Image
                  </th>
                  <th 
                    onClick={() => handleSort('bannerType')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Type
                      {sortConfig.key === 'bannerType' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('order')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Order
                      {sortConfig.key === 'order' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
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
                {filteredBanners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-body">{banner.title}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-500 font-body truncate">{banner.subtitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title} 
                          className="h-16 w-24 object-cover rounded-md border border-gray-200 cursor-pointer" 
                          onClick={() => handlePreview(banner)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity">
                          <Eye size={20} className="text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                        getBannerTypeClass(banner.bannerType)
                      }`}>
                        {getBannerTypeIcon(banner.bannerType)}
                        {getBannerTypeLabel(banner.bannerType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-body">{banner.order}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? (
                          <><CheckCircle size={14} className="mr-1" /> Active</>
                        ) : (
                          <><XCircle size={14} className="mr-1" /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handlePreview(banner)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
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

      {/* Banner Preview Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-heading">Banner Preview</h3>
              <button 
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="relative aspect-[21/9] mb-4">
                <img 
                  src={modalData.imageUrl} 
                  alt={modalData.title} 
                  className="w-full h-full object-cover rounded-md" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h2 className="text-3xl font-bold text-white font-heading mb-2">{modalData.title}</h2>
                  <p className="text-white font-body">{modalData.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 font-body mb-1">Banner Type</p>
                  <p className="font-medium font-body flex items-center">
                    {getBannerTypeIcon(modalData.bannerType)}
                    {getBannerTypeLabel(modalData.bannerType)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 font-body mb-1">Display Order</p>
                  <p className="font-medium font-body">{modalData.order}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500 font-body mb-1">Status</p>
                  <p className="font-medium font-body flex items-center">
                    {modalData.isActive ? (
                      <><CheckCircle size={16} className="mr-1 text-green-600" /> Active</>
                    ) : (
                      <><XCircle size={16} className="mr-1 text-red-600" /> Inactive</>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setModalData(null)} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-body hover:bg-gray-300"
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

export default ViewBanners;