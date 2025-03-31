// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import PropertiesSection from '../components/PropertiesSection';
import FeaturesSection from '../components/FeaturesSection';
import ReviewsSection from '../components/ReviewsSection';
import UnexploredSection from '../components/UnexploredSection';
import BlogsSection from '../components/BlogSection'; // Fixed import from BlogSection to BlogsSection

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/banners`);
        const activeBanners = res.data.filter(banner => banner.isActive);
        setBanners(activeBanners);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const goToBanner = (index) => {
    setCurrentBanner(index);
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="font-body">Loading...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="relative min-h-screen">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div 
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4">{banner.title}</h1>
                    {banner.subtitle && (
                      <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-body">{banner.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Banner navigation dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={`mx-1 w-2 h-2 md:w-3 md:h-3 rounded-full ${
                    index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold font-heading">Welcome to Nivaas</h1>
        </div>
      )}
      
      {/* Location Picker Section */}
      <LocationPicker />
      
      {/* Properties Section */}
      <PropertiesSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Reviews Section */}
      <ReviewsSection />
      
      {/* Unexplored Section */}
      <UnexploredSection />
      
      {/* Blogs Section */}
      <BlogsSection />
    </div>
  );
};

export default HomePage;