// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import PropertyDetails from './pages/PropertyDetails';
import BlogsPage from './pages/BlogsPage';
import BlogDetail from './pages/BlogDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CityProperties from './pages/CityProperties';
import './App.css';
import WhatsAppButton from './components/WhatsappButton';
function App() {
  return (
    <Router>
     {/* WhatsApp button will appear on all pages */}
     <WhatsAppButton />
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/city/:id" element={<CityProperties />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;