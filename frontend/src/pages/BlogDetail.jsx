import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
        
        // Scroll to top when blog loads
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-500 font-body p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 font-heading">Error</h2>
          <p>{error || 'Blog not found'}</p>
          <Link to="/" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md font-body">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {blog.backgroundImage?.data ? (
          <img 
            src={blog.backgroundImage.data} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-900"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">{blog.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white">
              <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full font-body">
                Travel Destination
              </span>
              <span className="font-body text-sm">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold mb-4 font-heading text-gray-800">About This Destination</h2>
            <div className="prose max-w-none mb-6 font-body text-gray-700">
              {blog.description ? (
                blog.description.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                ))
              ) : (
                <p>No description available for this destination.</p>
              )}
            </div>
          </div>
          
          {/* Must Visit Things Section */}
          {blog.mustVisitThings && blog.mustVisitThings.length > 0 && (
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-8 font-heading text-center text-gray-800">
                Must Visit Places
              </h2>
              
              <div className="space-y-10">
                {blog.mustVisitThings.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-white rounded-lg shadow-md overflow-hidden`}
                  >
                    <div className="md:w-1/2">
                      {item.image?.data ? (
                        <img 
                          src={item.image.data} 
                          alt={item.heading} 
                          className="w-full h-64 md:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-4 font-body">
                        Must Visit #{index + 1}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 font-heading text-gray-800">
                        {item.heading}
                      </h3>
                      <p className="text-gray-700 font-body">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Travel Tips Section (using blog content if available) */}
          {blog.content && (
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
              <h2 className="text-2xl font-bold mb-4 font-heading text-gray-800">Travel Tips</h2>
              <div className="prose max-w-none font-body text-gray-700">
                {blog.content.split('\n').map((paragraph, index) => (
                  paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
                ))}
              </div>
            </div>
          )}
          
          {/* Gallery Section for Additional Images */}
          {blog.images && blog.images.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 font-heading text-center text-gray-800">
                Gallery
              </h2>
              
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                {/* Main Display Image */}
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={blog.images[activeImageIndex].data} 
                    alt={`${blog.title} gallery`} 
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Thumbnails */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {blog.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`rounded-md overflow-hidden cursor-pointer border-2 ${index === activeImageIndex ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={image.data} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Contact/Booking CTA */}
          <div className="bg-blue-50 rounded-lg p-6 md:p-8 mb-10 text-center">
            <h2 className="text-2xl font-bold mb-3 font-heading text-blue-800">Ready to Visit?</h2>
            <p className="text-blue-700 mb-6 font-body">Contact us to plan your trip to this amazing destination</p>
            <Link 
              to="/contact" 
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-body"
            >
              Plan My Trip
            </Link>
          </div>
          
          {/* Back to Blogs Button */}
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-body rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;