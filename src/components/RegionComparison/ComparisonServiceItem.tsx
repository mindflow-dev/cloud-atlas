import React, { useState } from 'react';
import { AWSService } from '../../types';
import { FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import AWSServiceIcon from '../AWSServiceIcon';
import { getRegionName } from '../../api';

interface ComparisonServiceItemProps {
  service: AWSService;
  supportedRegions: string[];
  unsupportedRegions: string[];
  isFullySupported?: boolean;
  isUnsupported?: boolean;
}

const ComparisonServiceItem: React.FC<ComparisonServiceItemProps> = ({
  service,
  supportedRegions,
  unsupportedRegions,
  isFullySupported = false,
  isUnsupported = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine the status color
  const getStatusColor = () => {
    if (isFullySupported) return 'bg-emerald-100 text-emerald-800';
    if (isUnsupported) return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  // Determine the status text
  const getStatusText = () => {
    if (isFullySupported) return 'Supported Everywhere';
    if (isUnsupported) return 'Unsupported Everywhere';
    return 'Partially Supported';
  };

  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      {/* Service header */}
      <div 
        className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0 mr-3">
          <AWSServiceIcon service={service} size="sm" />
        </div>
        
        <div className="flex-grow">
          <div className="font-medium">{service.name}</div>
          <div className="text-xs text-gray-500">{service.serviceCode}</div>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full mr-3 ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {!isFullySupported && !isUnsupported && (
            <div className="text-xs text-gray-500 mr-3">
              {supportedRegions.length} of {supportedRegions.length + unsupportedRegions.length} regions
            </div>
          )}
          {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && !isFullySupported && !isUnsupported && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supported regions */}
            {supportedRegions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-emerald-700 flex items-center">
                  <FaCheck className="mr-1" /> Supported Regions
                </h4>
                <ul className="text-sm">
                  {supportedRegions.map(regionId => (
                    <li key={regionId} className="mb-1 flex items-center">
                      <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                        <FaCheck className="text-emerald-600 text-xs" />
                      </span>
                      <span className="font-medium">{getRegionName(regionId)}</span>
                      <span className="text-xs text-gray-500 ml-1">({regionId})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Unsupported regions */}
            {unsupportedRegions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 text-red-700 flex items-center">
                  <FaTimes className="mr-1" /> Unsupported Regions
                </h4>
                <ul className="text-sm">
                  {unsupportedRegions.map(regionId => (
                    <li key={regionId} className="mb-1 flex items-center">
                      <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                        <FaTimes className="text-red-600 text-xs" />
                      </span>
                      <span className="font-medium">{getRegionName(regionId)}</span>
                      <span className="text-xs text-gray-500 ml-1">({regionId})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonServiceItem; 