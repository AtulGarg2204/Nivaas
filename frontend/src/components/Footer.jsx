import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from '../assets/logo_nivaas.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [cities, setCities] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both cities and properties in parallel
        const [citiesRes, propertiesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/cities`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/properties`)
        ]);
        
        // Filter and sort cities
        const sortedCities = citiesRes.data
          .filter(city => city.isActive)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setCities(sortedCities);
        
        // Filter and sort properties by creation date (oldest first)
        const sortedProperties = propertiesRes.data
          .filter(property => property.isActive)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .slice(0, 5);
        setTopProperties(sortedProperties);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data for footer:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <footer className="bg-[#13140f] text-white">
      <div className="container mx-auto py-12">
        <div className="px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Column 1: Company info - Now taking 6 of 12 columns */}
            <div className="text-left md:col-span-6">
              {/* Logo - Left aligned */}
              <div className="mb-6">
                <img src={logo} alt="NIVAAS Logo" className="h-12" />
              </div>
              
              <p className="text-gray-300 font-body font-normal mb-4 max-w-xl">
                Partner with NIVAAS today and let's grow together. Elevate your property, reach more guests, and maximize your potential.
              </p>

              {/* Social Icons - Only Instagram and WhatsApp */}
              <div className="flex space-x-6 mt-4 mb-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg className="w-7 h-7 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://wa.me/917969469950" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg className="w-7 h-7 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>

              {/* For Bookings Contact - Vertical layout */}
              <div className="flex items-center gap-28 mb-4">
                <div>
                  <span className="text-gray-400 text-sm font-body font-light">For bookings contact</span>
                  <div className="text-gray-300 text-sm font-body font-normal">1-800-111-825</div>
                </div>
                <div className="text-gray-300 text-sm font-body font-normal">
                  reservations@ihcltata.com
                </div>
              </div>
            </div>

            {/* Column 2: Top Destinations (Dynamic from API) - Now taking 3 of 12 columns */}
            <div className="text-left md:col-span-3">
              <h3 className="text-lg font-medium font-subheading mb-3 text-white">Top Destinations</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-5 bg-gray-700/50 rounded w-24 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {cities.map((city) => (
                    <li key={city._id}>
                      <Link 
                        to={`/city/${city._id}`} 
                        className="text-gray-300 hover:text-white transition-colors font-body font-normal"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Column 3: Top Rated Properties (replacing Company section) */}
            <div className="text-left md:col-span-3">
              <h3 className="text-lg font-medium font-subheading mb-3 text-white">Top Rated Properties</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="h-5 bg-gray-700/50 rounded w-36 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {topProperties.map((property) => (
                    <li key={property._id}>
                      <Link 
                        to={`/property/${property._id}`} 
                        className="text-gray-300 hover:text-white transition-colors font-body font-normal"
                      >
                        {property.name}
                      </Link>
                    </li>
                  ))}
                  {topProperties.length === 0 && (
                    <li className="text-gray-400">No properties available</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section with "Find us on" links - Increased spacing */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto py-6">
          <div className="px-6 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-body font-light">
              © {currentYear} NIVAAS. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-gray-400 text-sm font-body font-light mr-4">Find us on</span>
              <div className="flex space-x-4">
                {/* Airbnb Image */}
                <a href="https://airbnb.com" target="_blank" rel="noopener noreferrer" aria-label="Airbnb">
                  <img 
                    src="/airbnb.png" 
                    alt="Airbnb" 
                    className="w-6 h-6 object-contain filter brightness-75 hover:brightness-100 transition-all" 
                  />
                </a>
                
                {/* MakeMyTrip Image */}
                <a href="https://makemytrip.com" target="_blank" rel="noopener noreferrer" aria-label="MakeMyTrip">
                  <img 
                    src="/makemytrip.png" 
                    alt="MakeMyTrip" 
                    className="w-6 h-6 object-contain filter brightness-75 hover:brightness-100 transition-all" 
                  />
                </a>
                
                {/* Goibibo Image */}
                <a href="https://goibibo.com" target="_blank" rel="noopener noreferrer" aria-label="Goibibo">
                  <img 
                    src="/goibibo-remove.png" 
                    alt="Goibibo" 
                    className="w-6 h-6 object-contain filter brightness-75 hover:brightness-100 transition-all" 
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;