import React, { useState, useEffect, useRef } from 'react';
import { AWSService } from '../../types';
import { FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

interface ServiceSelectorProps {
  services: AWSService[];
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServices,
  onServicesChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter services based on search term
  const filteredServices = services
    .filter(service => 
      !selectedServices.includes(service.serviceCode) &&
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, 100); // Limit to 100 results for performance

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add a service to the selected services
  const handleAddService = (serviceCode: string) => {
    onServicesChange([...selectedServices, serviceCode]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Remove a service from the selected services
  const handleRemoveService = (serviceCode: string) => {
    onServicesChange(selectedServices.filter(code => code !== serviceCode));
  };

  // Get service name by service code
  const getServiceName = (serviceCode: string): string => {
    const service = services.find(s => s.serviceCode === serviceCode);
    return service ? service.name : serviceCode;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Services to Compare
      </label>
      
      {/* Selected services */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedServices.map(serviceCode => (
          <div 
            key={serviceCode}
            className="flex items-center bg-aws-blue-100 text-aws-blue-800 px-3 py-1 rounded-full text-sm"
          >
            <span>{getServiceName(serviceCode)}</span>
            <button
              className="ml-2 text-aws-blue-600 hover:text-aws-blue-800"
              onClick={() => handleRemoveService(serviceCode)}
              aria-label={`Remove ${getServiceName(serviceCode)}`}
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
        
        {selectedServices.length === 0 && (
          <div className="text-gray-500 text-sm italic">
            No services selected. Add services below.
          </div>
        )}
      </div>
      
      {/* Service search */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-aws-orange focus:border-aws-orange sm:text-sm"
              placeholder="Search for AWS services..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>
        </div>
        
        {/* Dropdown for service selection */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {filteredServices.length > 0 ? (
              filteredServices.map(service => (
                <div
                  key={service.serviceCode}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddService(service.serviceCode)}
                >
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.serviceCode}</div>
                  </div>
                  <FaPlus className="text-aws-orange" />
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                {searchTerm ? "No matching services found" : "Start typing to search for services"}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Help text */}
      <p className="mt-1 text-xs text-gray-500">
        Select at least 2 services to compare their regional availability
      </p>
    </div>
  );
};

export default ServiceSelector; 