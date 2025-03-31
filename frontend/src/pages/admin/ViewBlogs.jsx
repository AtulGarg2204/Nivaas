// frontend/src/pages/admin/ViewBlogs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Eye, 
  ArrowUp,
  ArrowDown,
  X,
  Calendar,
  MessageSquare,

  List
} from 'lucide-react';

const ViewBlogs = ({ onEditBlog = () => {} }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
      setBlogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog._id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError('Failed to delete blog');
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

  const handleViewDetails = (blog) => {
    setModalData(blog);
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    // Handle special case for mustVisitThings.length
    if (sortConfig.key === 'mustVisitThingsCount') {
      const aCount = a.mustVisitThings?.length || 0;
      const bCount = b.mustVisitThings?.length || 0;
      
      if (aCount < bCount) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aCount > bCount) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    
    // Handle dates
    if (sortConfig.key === 'createdAt') {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      
      if (aDate < bDate) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aDate > bDate) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
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

  const filteredBlogs = sortedBlogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    blog.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 rounded bg-red-100 text-red-700 border border-red-300 font-body">
          {error}
          <button 
            onClick={fetchBlogs} 
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
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-body"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={fetchBlogs}
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
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-body">
            <p>No blogs found {searchTerm && `matching "${searchTerm}"`}</p>
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
                      Blog
                      {sortConfig.key === 'title' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('mustVisitThingsCount')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Must Visit Items
                      {sortConfig.key === 'mustVisitThingsCount' && (
                        sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('createdAt')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-body cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === 'createdAt' && (
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
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {blog.backgroundImage?.data ? (
                            <img 
                              className="h-10 w-10 rounded-md object-cover border border-gray-200" 
                              src={blog.backgroundImage.data} 
                              alt={blog.title}
                              onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=Blog"; }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <MessageSquare size={18} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4 max-w-md">
                          <div className="text-sm font-medium text-gray-900 truncate font-body">{blog.title}</div>
                          <div className="text-sm text-gray-500 truncate font-body">{blog.description ? blog.description.substring(0, 50) + '...' : 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <List size={14} className="mr-1" />
                        {blog.mustVisitThings?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-body flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(blog)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditBlog(blog)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
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

      {/* Blog Details Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-heading">Blog Details</h3>
              <button 
                onClick={() => setModalData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              {/* Background Image */}
              {modalData.backgroundImage?.data && (
                <div className="relative h-60">
                  <img 
                    src={modalData.backgroundImage.data} 
                    alt={modalData.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/1200x400?text=Blog+Image"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <h2 className="text-white text-3xl font-bold font-heading">{modalData.title}</h2>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Blog Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-bold font-heading mb-2">Description</h4>
                  <p className="font-body text-gray-700 whitespace-pre-line">{modalData.description}</p>
                </div>
                
                {/* Must Visit Things */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold font-heading mb-4 flex items-center">
                    <List size={18} className="mr-2" /> 
                    Must Visit Things ({modalData.mustVisitThings?.length || 0})
                  </h4>
                  
                  {modalData.mustVisitThings && modalData.mustVisitThings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modalData.mustVisitThings.map((item, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden bg-gray-50">
                          {item.image?.data && (
                            <img 
                              src={item.image.data} 
                              alt={item.heading} 
                              className="w-full h-48 object-cover"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Must+Visit"; }}
                            />
                          )}
                          <div className="p-4">
                            <h5 className="font-heading font-bold text-lg mb-2">{item.heading}</h5>
                            <p className="font-body text-gray-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 font-body italic">No must visit items found</p>
                  )}
                </div>
                
                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 font-body">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    Created: {formatDate(modalData.createdAt)}
                  </div>
                  {modalData.updatedAt && (
                    <div className="flex items-center">
                      <RefreshCw size={16} className="mr-2 text-gray-400" />
                      Last Updated: {formatDate(modalData.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => onEditBlog(modalData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-body hover:bg-blue-700 mr-2"
              >
                Edit Blog
              </button>
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

export default ViewBlogs;