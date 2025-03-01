import React, { useState } from 'react';
import { ServiceComparisonResult } from '../../utils/compareServices';
import ComparisonRegionItem from './ComparisonRegionItem';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getRegionName } from '../../api';
import { AWSService } from '../../types';

interface ComparisonResultsProps {
  results: ServiceComparisonResult;
  selectedServices: string[];
  services: AWSService[];
}

type FilterType = 'all' | 'available' | 'partial' | 'unavailable';

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results, selectedServices, services }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('partial');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Count regions in each category
  const availableCount = results.availableInAllServices.length;
  const partialCount = results.partiallyAvailableRegions.length;
  const unavailableCount = results.unavailableInAllServices.length;
  const totalCount = availableCount + partialCount + unavailableCount;

  // Filter regions based on selected filter
  const getFilteredResults = () => {
    switch (filter) {
      case 'available':
        return {
          ...results,
          partiallyAvailableRegions: [],
          unavailableInAllServices: []
        };
      case 'partial':
        return {
          ...results,
          availableInAllServices: [],
          unavailableInAllServices: []
        };
      case 'unavailable':
        return {
          ...results,
          availableInAllServices: [],
          partiallyAvailableRegions: []
        };
      default:
        return results;
    }
  };

  const filteredResults = getFilteredResults();

  // Get service names for display
  const getServiceNames = () => {
    return selectedServices.map(code => {
      const service = services.find(s => s.serviceCode === code);
      return service ? service.name : code;
    });
  };

  // Format selected services for display
  const formatSelectedServices = () => {
    const serviceNames = getServiceNames();
    if (serviceNames.length <= 2) {
      return serviceNames.join(' and ');
    }
    return `${serviceNames.length} services`;
  };

  return (
    <div className="mt-4">
      {/* Header with filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Comparison Results: <span className="text-aws-orange">{formatSelectedServices()}</span>
        </h2>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <option value="all">All Regions</option>
            <option value="available">Available Everywhere</option>
            <option value="partial">Partially Available</option>
            <option value="unavailable">Unavailable Everywhere</option>
          </select>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-emerald-50 p-3 rounded-md border border-emerald-100">
          <div className="text-emerald-700 font-semibold">{availableCount}</div>
          <div className="text-sm text-emerald-600">Available in All Services</div>
          <div className="text-xs text-emerald-500">{Math.round((availableCount / totalCount) * 100)}% of regions</div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
          <div className="text-amber-700 font-semibold">{partialCount}</div>
          <div className="text-sm text-amber-600">Partially Available</div>
          <div className="text-xs text-amber-500">{Math.round((partialCount / totalCount) * 100)}% of regions</div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-md border border-red-100">
          <div className="text-red-700 font-semibold">{unavailableCount}</div>
          <div className="text-sm text-red-600">Unavailable in All Services</div>
          <div className="text-xs text-red-500">{Math.round((unavailableCount / totalCount) * 100)}% of regions</div>
        </div>
      </div>

      {/* Results sections */}
      <div className="space-y-4">
        {/* Partially Available Regions */}
        {filteredResults.partiallyAvailableRegions.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-amber-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('partial')}
            >
              <h3 className="font-semibold text-amber-800">
                🟡 Partially Available Regions ({filteredResults.partiallyAvailableRegions.length})
              </h3>
              {expandedSection === 'partial' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'partial' && (
              <div className="p-3">
                {filteredResults.partiallyAvailableRegions.map((item) => (
                  <ComparisonRegionItem
                    key={item.region}
                    region={item.region}
                    supportedServices={item.supportedServices}
                    unsupportedServices={item.unsupportedServices}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Available in All Services */}
        {filteredResults.availableInAllServices.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-emerald-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('available')}
            >
              <h3 className="font-semibold text-emerald-800">
                🟢 Available in All Services ({filteredResults.availableInAllServices.length})
              </h3>
              {expandedSection === 'available' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'available' && (
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredResults.availableInAllServices.map((regionId) => (
                  <div 
                    key={regionId}
                    className="bg-emerald-50 p-2 rounded border border-emerald-100 text-emerald-800"
                  >
                    {getRegionName(regionId)}
                    <div className="text-xs text-emerald-600">{regionId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Unavailable in All Services */}
        {filteredResults.unavailableInAllServices.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-red-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('unavailable')}
            >
              <h3 className="font-semibold text-red-800">
                🔴 Unavailable in All Services ({filteredResults.unavailableInAllServices.length})
              </h3>
              {expandedSection === 'unavailable' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'unavailable' && (
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredResults.unavailableInAllServices.map((regionId) => (
                  <div 
                    key={regionId}
                    className="bg-red-50 p-2 rounded border border-red-100 text-red-800"
                  >
                    {getRegionName(regionId)}
                    <div className="text-xs text-red-600">{regionId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* No results message */}
      {totalCount === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-md border">
          <p className="text-gray-500">No comparison results available.</p>
          <p className="text-sm text-gray-400 mt-1">Please select at least two services to compare.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonResults; 