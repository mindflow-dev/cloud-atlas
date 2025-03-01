import React, { useState, useEffect } from 'react';
import { AWSEndpointData, AWSService } from '../../types';
import ServiceSelector from './ServiceSelector';
import ComparisonResults from './ComparisonResults';
import { compareServices, ServiceComparisonResult } from '../../utils/compareServices';
import { getServices } from '../../api';
import { FaExchangeAlt } from 'react-icons/fa';

interface ServiceComparisonProps {
  awsData: AWSEndpointData;
}

const ServiceComparison: React.FC<ServiceComparisonProps> = ({ awsData }) => {
  const [services, setServices] = useState<AWSService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ServiceComparisonResult | null>(null);

  // Load services on component mount
  useEffect(() => {
    if (awsData) {
      const allServices = getServices(awsData);
      setServices(allServices);
    }
  }, [awsData]);

  // Update comparison results when selected services change
  useEffect(() => {
    if (selectedServices.length >= 2) {
      const results = compareServices(awsData, selectedServices);
      setComparisonResults(results);
    } else {
      setComparisonResults(null);
    }
  }, [selectedServices, awsData]);

  // Handle service selection changes
  const handleServicesChange = (newSelectedServices: string[]) => {
    setSelectedServices(newSelectedServices);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center mb-2">
          <FaExchangeAlt className="text-aws-orange mr-2" />
          <h2 className="text-xl font-semibold">Service Comparison</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Select multiple AWS services to compare regional availability across them
        </p>
        
        <ServiceSelector
          services={services}
          selectedServices={selectedServices}
          onServicesChange={handleServicesChange}
        />
        
        {selectedServices.length === 1 && (
          <div className="mt-2 text-amber-600 text-sm">
            Please select at least one more service to compare.
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-auto">
        {comparisonResults && selectedServices.length >= 2 ? (
          <ComparisonResults
            results={comparisonResults}
            selectedServices={selectedServices}
            services={services}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md border">
            <p className="text-gray-500">No comparison results available.</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedServices.length === 0
                ? "Please select at least two services to compare."
                : selectedServices.length === 1
                ? "Please select at least one more service to compare."
                : "Something went wrong. Please try again."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceComparison; 