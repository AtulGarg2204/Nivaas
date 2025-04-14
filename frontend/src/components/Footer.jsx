import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from '../assets/logo_nivaas.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cities`);
        // Sort by created date (newest first) and take top 4
        const sortedCities = res.data
          .filter(city => city.isActive)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setCities(sortedCities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities for footer:', error);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);
  
  return (
    <footer className="bg-[#0e3f44] text-white">
      <div className="container mx-auto py-12">
        <div className="px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            {/* Column 1: Company info - Now taking 6 of 12 columns */}
            <div className="text-left md:col-span-6">
              {/* Logo - Left aligned */}
              <div className="mb-6">
                <img src={logo} alt="NIVAAS Logo" className="h-12" />
              </div>
              
              <p className="text-gray-300 font-body mb-4 max-w-xl">
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
    <span className="text-gray-400 text-sm">For bookings contact</span>
    <div className="text-gray-300 text-sm font-body">1-800-111-825</div>
  </div>
  <div className="text-gray-300 text-sm font-body">
    reservations@ihcltata.com
  </div>
</div>


            </div>

            {/* Column 2: Top Destinations (Dynamic from API) - Now taking 3 of 12 columns */}
            <div className="text-left md:col-span-3">
              <h3 className="text-lg font-bold mb-3 text-white font-heading">Top Destinations</h3>
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
                        className="text-gray-300 hover:text-white transition-colors font-body"
                      >
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Column 3: Company with Privacy Policy and Terms - Now taking 3 of 12 columns */}
            <div className="text-left md:col-span-3">
              <h3 className="text-lg font-bold mb-3 text-white font-heading">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-body">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors font-body">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors font-body">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors font-body">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section with "Find us on" links - Increased spacing */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto py-6">
          <div className="px-6 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-body">
              © {currentYear} NIVAAS. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-gray-400 text-sm mr-4">Find us on</span>
              <div className="flex space-x-4">
                {/* Airbnb Icon */}
                <a href="https://airbnb.com" target="_blank" rel="noopener noreferrer" aria-label="Airbnb">
                  <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.0001 2C13.2501 2 14.2589 2.97471 14.2591 4.17547C14.2591 5.3764 13.2501 6.35095 12.0001 6.35095C10.7501 6.35095 9.74107 5.3764 9.74107 4.17547C9.74107 2.97471 10.7501 2 12.0001 2ZM12.0001 13.9163C11.7189 13.9163 11.4051 13.8159 11.1245 13.6496C8.26339 12.0696 5.4383 8.46891 5.4383 5.20687C5.4383 2.96551 7.20411 1.15424 9.38545 1.15424C10.3256 1.15424 11.2404 1.52514 12.0001 2.10958C12.7599 1.52498 13.6745 1.15424 14.6147 1.15424C16.7961 1.15424 18.5619 2.96551 18.5619 5.20687C18.5619 8.47342 15.7369 12.0696 12.8756 13.6496C12.5951 13.8159 12.2814 13.9163 12.0001 13.9163ZM18.2275 14.8084C18.4315 14.6754 18.6777 14.6052 18.9296 14.6052C19.1813 14.6052 19.4277 14.6754 19.6315 14.8084C22.4461 16.7433 24 18.6163 24 20.8884C24 22.9514 22.2342 24 20.1428 24C19.0292 24 18.0226 23.7311 17.1483 23.2162L12.005 20.4377L6.85172 23.2162C5.97741 23.7311 4.9708 24 3.85718 24C1.76584 24 0 22.9514 0 20.8884C0 18.6163 1.55389 16.7433 4.36848 14.8083C4.57227 14.6753 4.81875 14.6051 5.07044 14.6051C5.3223 14.6051 5.56861 14.6753 5.77241 14.8083C5.97621 14.9414 6.13695 15.1271 6.23286 15.3456C6.32878 15.564 6.35546 15.8055 6.30905 16.0371C6.26265 16.2687 6.14548 16.4795 5.97386 16.6393C3.97266 18.0095 2.67857 19.4447 2.67857 20.8884C2.67857 21.9366 3.41518 22.5 3.85718 22.5C4.56027 22.5 5.23304 22.308 5.79134 21.9799L11.2649 19.0335C11.4989 18.8999 11.7625 18.8289 12.0301 18.8289C12.2977 18.8289 12.5612 18.8999 12.7952 19.0335L18.2687 21.9799C18.827 22.308 19.3873 22.5 20.1428 22.5C20.5848 22.5 21.3214 21.9366 21.3214 20.8884C21.3214 19.4447 20.0273 18.0095 18.0261 16.6393C17.8545 16.4795 17.7373 16.2687 17.6909 16.0371C17.6445 15.8055 17.6712 15.564 17.7671 15.3456C17.863 15.1271 18.0238 14.9414 18.2275 14.8084Z"/>
                  </svg>
                </a>
                
                {/* MakeMyTrip Icon */}
                <a href="https://makemytrip.com" target="_blank" rel="noopener noreferrer" aria-label="MakeMyTrip">
                  <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.1739 0H4.82609C2.1604 0 0 2.1604 0 4.82609V19.1739C0 21.8396 2.1604 24 4.82609 24H19.1739C21.8396 24 24 21.8396 24 19.1739V4.82609C24 2.1604 21.8396 0 19.1739 0ZM12 17.8019C7.84716 17.8019 4.41507 14.5728 4.41507 10.6087C4.41507 6.64454 7.84716 3.41553 12 3.41553C16.1528 3.41553 19.5849 6.64454 19.5849 10.6087C19.5849 14.5728 16.1528 17.8019 12 17.8019ZM12 6.13043C9.26211 6.13043 7.13043 8.15342 7.13043 10.6087C7.13043 13.0639 9.26211 15.087 12 15.087C14.7379 15.087 16.8696 13.0639 16.8696 10.6087C16.8696 8.15342 14.7379 6.13043 12 6.13043ZM12 13.0435C10.5646 13.0435 9.3913 11.9903 9.3913 10.6087C9.3913 9.22702 10.5646 8.17391 12 8.17391C13.4354 8.17391 14.6087 9.22702 14.6087 10.6087C14.6087 11.9903 13.4354 13.0435 12 13.0435Z"/>
                  </svg>
                </a>
                
                {/* Goibibo Icon */}
                <a href="https://goibibo.com" target="_blank" rel="noopener noreferrer" aria-label="Goibibo">
                  <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15 6.5C15 7.33 14.33 8 13.5 8C12.67 8 12 7.33 12 6.5C12 5.67 12.67 5 13.5 5C14.33 5 15 5.67 15 6.5ZM9 6.5C9 7.33 8.33 8 7.5 8C6.67 8 6 7.33 6 6.5C6 5.67 6.67 5 7.5 5C8.33 5 9 5.67 9 6.5ZM12 18C9.24 18 7 15.76 7 13H9C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13H17C17 15.76 14.76 18 12 18Z"/>
                  </svg>
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