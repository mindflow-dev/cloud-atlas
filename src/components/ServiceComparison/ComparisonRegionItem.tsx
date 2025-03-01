import React, { useState } from 'react';
import { AWSService } from '../../types';
import { FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import { getRegionName } from '../../api';

interface ComparisonRegionItemProps {
  region: string;
  supportedServices: AWSService[];
  unsupportedServices: AWSService[];
  isFullySupported?: boolean;
  isUnsupported?: boolean;
}

const ComparisonRegionItem: React.FC<ComparisonRegionItemProps> = ({
  region,
  supportedServices,
  unsupportedServices,
  isFullySupported = false,
  isUnsupported = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate support percentage
  const totalServices = supportedServices.length + unsupportedServices.length;
  const supportPercentage = totalServices > 0 
    ? Math.round((supportedServices.length / totalServices) * 100) 
    : 0;
  
  // Determine color based on support percentage
  const getColorClass = () => {
    if (isFullySupported) return 'bg-emerald-50 border-emerald-100';
    if (isUnsupported) return 'bg-red-50 border-red-100';
    
    if (supportPercentage >= 75) return 'bg-emerald-50 border-emerald-100';
    if (supportPercentage >= 25) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };
  
  const getTextColorClass = () => {
    if (isFullySupported) return 'text-emerald-800';
    if (isUnsupported) return 'text-red-800';
    
    if (supportPercentage >= 75) return 'text-emerald-800';
    if (supportPercentage >= 25) return 'text-amber-800';
    return 'text-red-800';
  };
  
  return (
    <div className={`mb-2 rounded-md border overflow-hidden ${getColorClass()}`}>
      <div 
        className={`p-3 flex items-center justify-between cursor-pointer ${getTextColorClass()}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-grow">
          <div className="font-medium">{getRegionName(region)}</div>
          <div className="text-xs opacity-75">{region}</div>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm mr-3">
            <span className="font-semibold">{supportPercentage}%</span> supported
          </div>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Supported Services */}
            <div>
              <h4 className="text-sm font-medium text-emerald-700 mb-2">
                <FaCheck className="inline-block mr-1" /> Supported Services ({supportedServices.length})
              </h4>
              <ul className="text-sm space-y-1">
                {supportedServices.map(service => (
                  <li key={service.id} className="text-gray-700">
                    {service.name}
                    <span className="text-xs text-gray-500 ml-1">({service.serviceCode})</span>
                  </li>
                ))}
                {supportedServices.length === 0 && (
                  <li className="text-gray-500 italic">No supported services</li>
                )}
              </ul>
            </div>
            
            {/* Unsupported Services */}
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">
                <FaTimes className="inline-block mr-1" /> Unsupported Services ({unsupportedServices.length})
              </h4>
              <ul className="text-sm space-y-1">
                {unsupportedServices.map(service => (
                  <li key={service.id} className="text-gray-700">
                    {service.name}
                    <span className="text-xs text-gray-500 ml-1">({service.serviceCode})</span>
                  </li>
                ))}
                {unsupportedServices.length === 0 && (
                  <li className="text-gray-500 italic">No unsupported services</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonRegionItem; 