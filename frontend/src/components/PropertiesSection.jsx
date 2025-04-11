import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PropertiesSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/properties`
        );
        setProperties(res.data.filter((property) => property.isActive));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 10 }
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-b from-white to-gray-50/50 relative">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 h-80 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-b from-white to-gray-50/50 relative">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-left text-red-500 font-body p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50/50 relative">
      {/* Background decorative elements that blend with LocationPicker */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute -top-64 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-gradient-to-tl from-yellow-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left mb-12 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-gray-800 drop-shadow-sm">
            Explore Our Premium Properties
          </h2>
          <p className="text-gray-600 font-body pl-0.5">
            Indulge in ultra-luxurious villas with lavish amenities & personalized services
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {properties.map((property, index) => (
            <motion.div
              key={property._id}
              variants={itemVariants}
              custom={index}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 } 
              }}
              className="max-w-sm mx-auto" // Added max-width to decrease card size
            >
              <Link
                to={`/property/${property._id}`}
                className="group block h-full"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] h-full flex flex-col backdrop-blur-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-40 group-hover:opacity-0 transition-opacity duration-300"></div>
                    
                    {/* Reflection effect on top */}
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/30 to-transparent z-10"></div>
                    
                    <img
                      src={property.images[0]?.data}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    {/* Removed price tag */}
                  </div>
                  <div className="p-5 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50/70">
                    <div className="mb-1 flex items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold font-heading text-gray-800 text-left group-hover:text-[#a0936a] transition-colors duration-300">
                          {property.name}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium font-body">
                          {property.rating?.average.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <p className="text-gray-600 font-body text-left pl-0.5">
                        {property.subplace && (
                          <span>{property.subplace}, </span>
                        )}
                        {property.city}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-left">
                      <span className="text-sm text-gray-600 font-body flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {property.guests} guests
                      </span>
                      <span className="text-sm text-gray-600 font-body flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.rooms} rooms
                      </span>
                      <span className="text-sm text-gray-600 font-body flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        {property.beds} beds
                      </span>
                      <span className="text-sm text-gray-600 font-body flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {property.baths} baths
                      </span>
                    </div>
                    
                    <div className="mt-auto text-left">
                      <button className="bg-[rgba(14,63,68,0.95)] hover:bg-[rgba(14,63,68,1)] text-white rounded-lg px-5 py-2.5 text-sm font-medium font-body transition-all duration-300 shadow-sm hover:shadow-[rgba(14,63,68,0.2)] group-hover:shadow-lg">
                        View Details
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {properties.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-left py-8"
          >
            <p className="font-body text-gray-600 bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100">
              No properties available at the moment. Please check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PropertiesSection;