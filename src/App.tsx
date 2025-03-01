import React, { useState, useEffect } from 'react';
import { fetchAWSData, getServices, getServiceRegions } from './api';
import { AWSEndpointData, AWSService, AWSRegion } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RegionList from './components/RegionList';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import RegionComparison from './components/RegionComparison';
import { FaSearch, FaExchangeAlt } from 'react-icons/fa';

// Define view types
type ViewType = 'service-search' | 'region-comparison';

function App() {
  const [awsData, setAwsData] = useState<AWSEndpointData | null>(null);
  const [services, setServices] = useState<AWSService[]>([]);
  const [selectedService, setSelectedService] = useState<AWSService | null>(null);
  const [serviceRegions, setServiceRegions] = useState<AWSRegion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('service-search');

  // Fetch AWS data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchAWSData();
        setAwsData(data);
        
        const servicesList = getServices(data);
        console.log('Services loaded:', servicesList.length);
        setServices(servicesList);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch AWS data. Please try again later.');
        setLoading(false);
        console.error('Error loading AWS data:', err);
      }
    };

    loadData();
  }, []);

  // Handle service selection
  const handleServiceSelect = (service: AWSService) => {
    setSelectedService(service);
    
    if (awsData) {
      const regions = getServiceRegions(awsData, service.serviceCode);
      setServiceRegions(regions);
    }
  };

  // Handle retry when error occurs
  const handleRetry = () => {
    window.location.reload();
  };

  // Switch between views
  const switchView = (view: ViewType) => {
    setActiveView(view);
    // Reset selected service when switching to region comparison
    if (view === 'region-comparison') {
      setSelectedService(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-3 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="text-center mb-4 flex-shrink-0">
            <h2 className="text-3xl font-bold mb-2">AWS Region Service Availability</h2>
            <p className="text-gray-600 mb-4">
              Explore AWS service availability across regions
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mb-6">
              <div className="flex border rounded-md overflow-hidden">
                <button
                  className={`flex items-center px-4 py-2 ${
                    activeView === 'service-search'
                      ? 'bg-aws-orange text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => switchView('service-search')}
                >
                  <FaSearch className="mr-2" />
                  <span>Service Search</span>
                </button>
                <button
                  className={`flex items-center px-4 py-2 ${
                    activeView === 'region-comparison'
                      ? 'bg-aws-orange text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => switchView('region-comparison')}
                >
                  <FaExchangeAlt className="mr-2" />
                  <span>Region Comparison</span>
                </button>
              </div>
            </div>
            
            {/* Service Search Bar (only shown in service search view) */}
            {!loading && !error && activeView === 'service-search' && (
              <SearchBar 
                services={services} 
                onServiceSelect={handleServiceSelect} 
              />
            )}
          </div>
          
          <div className="flex-grow overflow-hidden">
            {loading && <LoadingSpinner message="Loading AWS service data..." />}
            
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            
            {!loading && !error && activeView === 'service-search' && selectedService && serviceRegions.length > 0 && (
              <RegionList 
                regions={serviceRegions} 
                serviceName={selectedService.name} 
              />
            )}
            
            {!loading && !error && activeView === 'region-comparison' && awsData && (
              <RegionComparison awsData={awsData} />
            )}
            
            {!loading && !error && activeView === 'service-search' && !selectedService && (
              <div className="text-center p-8 bg-gray-50 rounded-md border">
                <p className="text-gray-500">No service selected.</p>
                <p className="text-sm text-gray-400 mt-1">Search for an AWS service above to see its regional availability.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
