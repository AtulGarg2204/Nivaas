import React, { useState } from 'react';
import { Zap, Globe, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  const features = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Hassle-Free Getaways',
      subtitle: 'No need to plan months ahead—book your stays instantly, anytime.',
      highlight: 'Getaways',
      gradient: 'from-amber-500 to-orange-600',
      lightGradient: 'from-amber-50 to-orange-50',
      hoverColor: 'rgba(251, 191, 36, 0.1)'
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Flexible Destinations',
      subtitle: 'Choose from a variety of hotels across top unexplored spots in India',
      highlight: 'Destinations',
      gradient: 'from-emerald-500 to-teal-600',
      lightGradient: 'from-emerald-50 to-teal-50',
      hoverColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      title: 'Affordable Luxury',
      subtitle: 'Enjoy 5 nights at hotels of your choice with breakfast for just ₹10,000 a month',
      highlight: 'Luxury',
      gradient: 'from-blue-500 to-indigo-600',
      lightGradient: 'from-blue-50 to-indigo-50',
      hoverColor: 'rgba(59, 130, 246, 0.1)'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        damping: 12,
        stiffness: 70
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="py-16 relative overflow-hidden bg-gradient-to-tl from-gray-50 via-white to-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3" width="800" height="800" viewBox="0 0 800 800">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <circle cx="400" cy="400" r="400" fill="url(#grad1)" />
        </svg>
        
        <svg className="absolute bottom-0 left-0 opacity-10 transform -translate-x-1/3 translate-y-1/3" width="600" height="600" viewBox="0 0 600 600">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="300" fill="url(#grad2)" />
        </svg>
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="mb-12 text-left max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-gray-800 text-left">
            Why Choose <span className="text-blue-600">Nivaas</span>
          </h2>
          <p className="text-gray-600 font-body text-left">
            Experience the difference with our premium services and amenities
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="relative"
            >
              <div 
                className="h-full rounded-2xl p-1 transform transition-all duration-500"
                style={{
                  background: hoveredFeature === index ? 
                    `linear-gradient(140deg, ${feature.hoverColor}, transparent)` : 
                    'transparent'
                }}
              >
                <div className="bg-white h-full p-6 md:p-8 rounded-xl shadow-lg border border-gray-100/80 transition-all duration-300 hover:shadow-xl relative overflow-hidden flex flex-col">
                  {/* Decorative angle */}
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 rounded-full"
                    style={{
                      background: hoveredFeature === index ? 
                        `linear-gradient(45deg, ${feature.hoverColor}, transparent)` : 
                        'transparent',
                      transition: 'background 0.3s ease'
                    }}
                  ></div>
                  
                  <div className="flex items-start space-x-5 relative z-10 mb-6">
                    <motion.div 
                      className={`p-3 rounded-lg shadow-md bg-gradient-to-br ${feature.gradient} flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </motion.div>
                    
                    <div className="text-left">
                      <h3 className="text-xl font-bold font-heading text-gray-800 mb-2 text-left">
                        Hassle-Free <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                          {feature.highlight}
                        </span>
                      </h3>
                      <p className="text-gray-600 font-body text-left">{feature.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Reveal content on hover */}
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: hoveredFeature === index ? 1 : 0,
                      height: hoveredFeature === index ? 'auto' : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${feature.lightGradient} mb-4`}>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Premium service guarantee</li>
                        <li>24/7 customer support</li>
                        <li>Exclusive membership benefits</li>
                      </ul>
                    </div>
                  </motion.div>
                  
                  {/* Learn more link */}
                  <div className={`mt-auto ${hoveredFeature === index ? 'opacity-100' : 'opacity-70'} transition-opacity duration-300`}>
                    <div className="flex items-center text-sm font-medium bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 group cursor-pointer"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${hoveredFeature === index ? '#3b82f6, #6366f1' : '#6b7280, #6b7280'})`
                      }}
                    >
                      <span className="mr-1">Learn more</span>
                      <motion.div
                        animate={{ x: hoveredFeature === index ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight size={16} className={`transition-colors duration-300 ${hoveredFeature === index ? 'text-blue-600' : 'text-gray-500'}`} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Accent bar at bottom */}
              <motion.div 
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-xl`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredFeature === index ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesSection;