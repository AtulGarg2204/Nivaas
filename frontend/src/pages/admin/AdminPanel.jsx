// // frontend/src/pages/admin/AdminPanel.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BannerManagement from './BannerManagement';
// import CityManagement from './CityManagement';
// import PropertyManagement from './PropertyManagement';
// import ReviewManagement from './ReviewManagement';
// import BlogManagement from './BlogManagement';

// const AdminPanel = () => {
//   const [activeTab, setActiveTab] = useState('banners');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('adminAuthenticated');
//     navigate('/admin');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold font-poppins">Admin Panel</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-poppins"
//           >
//             Logout
//           </button>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="flex flex-wrap border-b">
//             <button
//               className={`px-4 py-3 font-medium font-poppins ${activeTab === 'banners' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//               onClick={() => setActiveTab('banners')}
//             >
//               Banner Management
//             </button>
//             <button
//               className={`px-4 py-3 font-medium font-poppins ${activeTab === 'cities' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//               onClick={() => setActiveTab('cities')}
//             >
//               City Management
//             </button>
//             <button
//               className={`px-4 py-3 font-medium font-poppins ${activeTab === 'properties' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//               onClick={() => setActiveTab('properties')}
//             >
//               Property Management
//             </button>
//             <button
//               className={`px-4 py-3 font-medium font-poppins ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//               onClick={() => setActiveTab('reviews')}
//             >
//               Review Management
//             </button>
//             <button
//               className={`px-4 py-3 font-medium font-poppins ${activeTab === 'blogs' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//               onClick={() => setActiveTab('blogs')}
//             >
//               Blog Management
//             </button>
//           </div>
          
//           <div className="p-6">
//             {activeTab === 'banners' && <BannerManagement />}
//             {activeTab === 'cities' && <CityManagement />}
//             {activeTab === 'properties' && <PropertyManagement />}
//             {activeTab === 'reviews' && <ReviewManagement />}
//             {activeTab === 'blogs' && <BlogManagement />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

// frontend/src/pages/admin/AdminPanel.js
// frontend/src/pages/admin/AdminPanel.js
// frontend/src/pages/admin/AdminPanel.js
// frontend/src/pages/admin/AdminPanel.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, LogOut, Menu, X } from 'lucide-react';

// Import all components
import BannerManagement from './BannerManagement';
import ViewBanners from './ViewBanners';
import CityManagement from './CityManagement';
import ViewCities from './ViewCities';
import AddProperty from './AddProperty';
import ViewProperties from './ViewProperties';

import AddReview from './AddReview';
import ViewReviews from './ViewReviews';

import AddBlog from './AddBlog';
import ViewBlogs from './ViewBlogs';


const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('cityManagement');
  const [activeSubSection, setActiveSubSection] = useState('addCity');
  const [expandedDropdown, setExpandedDropdown] = useState('cityManagement');
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const toggleDropdown = (section) => {
    setExpandedDropdown(expandedDropdown === section ? null : section);
  };

  const handleNavigation = (section, subSection) => {
    setActiveSection(section);
    setActiveSubSection(subSection);
    // Clear any editing state when navigating
    setEditingItem(null);
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleEditItem = (section, item) => {
    setActiveSection(section);
    
    // Set the correct subsection for editing based on section
    if (section === 'bannerManagement') {
      setActiveSubSection('addBanner');
    } else if (section === 'cityManagement') {
      setActiveSubSection('addCity');
    } else if (section === 'propertyManagement') {
      setActiveSubSection('addProperty');
    } else if (section === 'reviewManagement') {
      setActiveSubSection('addReview');
    } else if (section === 'blogManagement') {
      setActiveSubSection('addBlog');
    }
    
    setEditingItem(item);
    setExpandedDropdown(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'cityManagement':
        if (activeSubSection === 'addCity') {
          return <CityManagement editingCity={editingItem} onEditComplete={() => setEditingItem(null)} />;
        } else {
          return <ViewCities onEditCity={(city) => handleEditItem('cityManagement', city)} />;
        }
      case 'bannerManagement':
        if (activeSubSection === 'addBanner') {
          return <BannerManagement editingBanner={editingItem} onEditComplete={() => setEditingItem(null)} />;
        } else {
          return <ViewBanners onEditBanner={(banner) => handleEditItem('bannerManagement', banner)} />;
        }
     
      case 'propertyManagement':
        if (activeSubSection === 'addProperty') {
          return <AddProperty editingProperty={editingItem} onEditComplete={() => setEditingItem(null)} />;
        } else if (activeSubSection === 'viewProperties') {
          return <ViewProperties onEditProperty={(property) => handleEditItem('propertyManagement', property)} />;
        }
        return <AddProperty />;
      case 'reviewManagement':
        if (activeSubSection === 'addReview') {
          return <AddReview editingReview={editingItem} onEditComplete={() => setEditingItem(null)} />;
        } else if (activeSubSection === 'viewReviews') {
          return <ViewReviews onEditReview={(review) => handleEditItem('reviewManagement', review)} />;
        }
        return <AddReview />;
      case 'blogManagement':
        if (activeSubSection === 'addBlog') {
          return <AddBlog editingBlog={editingItem} onEditComplete={() => setEditingItem(null)} />;
        } else if (activeSubSection === 'viewBlogs') {
          return <ViewBlogs onEditBlog={(blog) => handleEditItem('blogManagement', blog)} />;
        }
        return <AddBlog />;
      default:
        return <CityManagement />;
    }
  };

  // Navigation items structure
  const navItems = [
    {
      id: 'bannerManagement',
      title: 'Banner Management',
      subItems: [
        { id: 'addBanner', title: 'Add Banner' },
        { id: 'viewBanners', title: 'View Banners' }
      ]
    },
    {
      id: 'cityManagement',
      title: 'City Management',
      subItems: [
        { id: 'addCity', title: 'Add City' },
        { id: 'viewCities', title: 'View Cities' }
      ]
    },
    {
      id: 'propertyManagement',
      title: 'Property Management',
      subItems: [
        { id: 'addProperty', title: 'Add Property' },
        { id: 'viewProperties', title: 'View Properties' }
      ]
    },
    {
      id: 'reviewManagement',
      title: 'Review Management',
      subItems: [
        { id: 'addReview', title: 'Add Review' },
        { id: 'viewReviews', title: 'View Reviews' }
      ]
    },
    {
      id: 'blogManagement',
      title: 'Blog Management',
      subItems: [
        { id: 'addBlog', title: 'Add Blog' },
        { id: 'viewBlogs', title: 'View Blogs' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex pt-4">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 bg-white p-2 rounded-md shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-xl z-20 w-72 fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-[#13130F] font-heading">Admin Dashboard</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4">
            {navItems.map((item) => (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-md font-body ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{item.title}</span>
                  {expandedDropdown === item.id ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
                
                {expandedDropdown === item.id && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavigation(item.id, subItem.id)}
                        className={`w-full text-left p-2 pl-6 text-sm rounded-md font-body ${
                          activeSection === item.id && activeSubSection === subItem.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-body transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <div className="p-6 md:p-8 min-h-screen">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#13130F] font-heading">
                {navItems.find(item => item.id === activeSection)?.title || 'Dashboard'}
                {' > '}
                {navItems
                  .find(item => item.id === activeSection)
                  ?.subItems.find(subItem => subItem.id === activeSubSection)?.title || 'Overview'}
                {editingItem && ' > Editing'}
              </h2>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;