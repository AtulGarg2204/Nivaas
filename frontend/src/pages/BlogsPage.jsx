// frontend/src/pages/BlogsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
        setBlogs(res.data.filter(blog => blog.isActive));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  // Filter blogs by category
  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === activeCategory);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-heading text-[#13130F]">Our Blogs</h1>
          <p className="text-gray-600 font-body max-w-2xl mx-auto">
            Discover travel stories, tips, and insights from our team of experienced travelers and luxury stay experts.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-body ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blogs Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link 
                to={`/blog/${blog._id}`} 
                key={blog._id}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={blog.thumbnailImage.data} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full font-body">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="text-xs text-gray-500 font-body mb-2">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-lg font-bold text-[#13130F] mb-2 font-heading">{blog.title}</h3>
                    {blog.subtitle && (
                      <p className="text-gray-600 text-sm font-body mb-4">{blog.subtitle}</p>
                    )}
                    <p className="text-gray-600 text-sm font-body mb-4 line-clamp-3">
                      {blog.content.split('\n')[0]}
                    </p>
                    <div className="mt-auto flex items-center">
                      <span className="text-blue-600 text-sm font-body">Read More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 font-body">No blogs found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;