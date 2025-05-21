
import { useState } from 'react';
import { Building } from 'lucide-react';

// Client logos data
const clientLogos = [
  "https://insightscare.in/wp-content/uploads/2025/03/12.png",
  "https://insightscare.in/wp-content/uploads/2025/03/13.png",
  "https://insightscare.in/wp-content/uploads/2025/03/14.png",
  "https://insightscare.in/wp-content/uploads/2025/03/2-1.png",
  "https://insightscare.in/wp-content/uploads/2025/03/1-1.png",
  "https://insightscare.in/wp-content/uploads/2025/03/15.png",
  "https://insightscare.in/wp-content/uploads/2025/03/16.png",
  "https://insightscare.in/wp-content/uploads/2025/03/4.png",
  "https://insightscare.in/wp-content/uploads/2025/03/5.png",
  "https://insightscare.in/wp-content/uploads/2025/03/6.png",
  "https://insightscare.in/wp-content/uploads/2025/03/7.png",
  "https://insightscare.in/wp-content/uploads/2025/03/8.png",
  "https://insightscare.in/wp-content/uploads/2025/03/9.png",
  "https://insightscare.in/wp-content/uploads/2025/03/10.png",
  "https://insightscare.in/wp-content/uploads/2025/03/11.png"
];

const ClientLogos = () => {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Subtle background pattern for texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-insightRed/10 text-insightRed rounded-full text-sm font-medium mb-4">
            <Building className="w-4 h-4 mr-2" /> Trusted By Leaders
          </div>
          <h2 className="text-4xl font-bold text-insightBlack mb-4">Our Prestigious Clients</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Global enterprises that trust InsightsBW for their executive marketing needs
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          {/* Desktop view - Grid layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8">
              {clientLogos.map((logo, index) => (
                <ClientLogo key={index} logo={logo} index={index} />
              ))}
            </div>
          </div>
          
          {/* Mobile view - Clean scrollable row */}
          <div className="md:hidden">
            <div className="p-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 min-w-max">
                {clientLogos.map((logo, index) => (
                  <ClientLogo key={index} logo={logo} index={index} mobileView />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center text-sm text-gray-500">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-insightRed"></span>
            Trusted by over 500+ global companies
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced client logo component with professional styling
const ClientLogo = ({ logo, index, mobileView = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`${mobileView ? 'w-28' : 'w-full'} aspect-[3/2] relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        h-full w-full rounded-md p-4 flex items-center justify-center bg-white 
        ${isHovered ? 'shadow-lg' : 'shadow-sm'} 
        transition-all duration-300 border border-gray-100
      `}>
        <img 
          src={logo} 
          alt={`Client ${index + 1}`}
          className={`
            max-h-full max-w-full object-contain filter 
            ${isHovered ? 'grayscale-0 opacity-100 scale-105' : 'grayscale opacity-80'} 
            transition-all duration-300
          `}
        />
      </div>
    </div>
  );
};

export default ClientLogos;
