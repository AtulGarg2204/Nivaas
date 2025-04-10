// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';
import PropertiesSection from '../components/PropertiesSection';
import FeaturesSection from '../components/FeaturesSection';
import ReviewsSection from '../components/ReviewsSection';
import BlogsSection from '../components/BlogSection';
import Footer from '../components/Footer';

const HomePage = () => {
  const [desktopBanners, setDesktopBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  // Function to check if device is mobile and set viewport height
  const handleResize = () => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    
    // Update viewport height
    if (isMobileView) {
      // For mobile, adjust to approx half the viewport height
      setViewportHeight('50vh'); // Half height for mobile so location picker is visible
    } else {
      // For desktop, use exact viewport height to ensure banner fills screen
      setViewportHeight('100vh');
    }
  };

  useEffect(() => {
    // Set initial state based on window size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        
        // Fetch both desktop and mobile banners simultaneously
        const [desktopRes, mobileRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/banners/type/desktop`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/banners/type/mobile`)
        ]);
        
        // Filter banners that are active and sort by order
        const activeDesktopBanners = desktopRes.data
          .filter(banner => banner.isActive)
          .sort((a, b) => a.order - b.order);
          
        const activeMobileBanners = mobileRes.data
          .filter(banner => banner.isActive)
          .sort((a, b) => a.order - b.order);
        
        setDesktopBanners(activeDesktopBanners);
        setMobileBanners(activeMobileBanners);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Reset current banner index when switching between mobile and desktop
  useEffect(() => {
    setCurrentBanner(0);
  }, [isMobile]);

  // Setup banner rotation interval
  useEffect(() => {
    const activeBanners = isMobile ? mobileBanners : desktopBanners;
    
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % activeBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, mobileBanners, desktopBanners]);

  const goToBanner = (index) => {
    setCurrentBanner(index);
  };

  // Get the appropriate banners based on device type
  const banners = isMobile ? mobileBanners : desktopBanners;

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="font-body">Loading...</p>
        </div>
      ) : banners.length > 0 ? (
        <div 
          className="relative w-full" 
          style={{ height: viewportHeight }}
        >
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
                    <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-heading font-bold mb-2 md:mb-4`}>
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className={`${isMobile ? 'text-lg' : 'text-xl sm:text-xl md:text-2xl lg:text-3xl'} font-body`}>
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Banner navigation dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center">
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
      
     
      <div className="bg-white">
  {/* Content sections with margins on mobile */}
  <div className={isMobile ? 'px-4' : ''}>
    {/* Location Picker Section */}
    <LocationPicker />
    
    {/* Properties Section */}
    <PropertiesSection />
    
    {/* Features Section */}
    <FeaturesSection />
    
    {/* Reviews Section */}
    <ReviewsSection />
    
    {/* Blogs Section */}
    <BlogsSection />
  </div>
  
  {/* Footer without additional side margins */}
  <Footer />
</div>
    </div>
  );
};

export default HomePage;