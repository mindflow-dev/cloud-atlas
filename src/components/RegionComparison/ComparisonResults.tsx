import React, { useState } from 'react';
import { RegionComparisonResult } from '../../utils/compareRegions';
import ComparisonServiceItem from './ComparisonServiceItem';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getRegionName } from '../../api';

interface ComparisonResultsProps {
  results: RegionComparisonResult;
  selectedRegions: string[];
}

type FilterType = 'all' | 'supported' | 'partial' | 'unsupported';

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ results, selectedRegions }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('partial');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Count services in each category
  const supportedCount = results.supportedEverywhere.length;
  const partialCount = results.partiallySupportedServices.length;
  const unsupportedCount = results.unsupportedEverywhere.length;
  const totalCount = supportedCount + partialCount + unsupportedCount;

  // Filter services based on selected filter
  const getFilteredResults = () => {
    switch (filter) {
      case 'supported':
        return {
          ...results,
          partiallySupportedServices: [],
          unsupportedEverywhere: []
        };
      case 'partial':
        return {
          ...results,
          supportedEverywhere: [],
          unsupportedEverywhere: []
        };
      case 'unsupported':
        return {
          ...results,
          supportedEverywhere: [],
          partiallySupportedServices: []
        };
      default:
        return results;
    }
  };

  const filteredResults = getFilteredResults();

  // Format selected regions for display
  const formatSelectedRegions = () => {
    if (selectedRegions.length <= 2) {
      return selectedRegions.map(r => getRegionName(r)).join(' and ');
    }
    return `${selectedRegions.length} regions`;
  };

  return (
    <div className="mt-4">
      {/* Header with filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Comparison Results: <span className="text-aws-orange">{formatSelectedRegions()}</span>
        </h2>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <option value="all">All Services</option>
            <option value="supported">Supported Everywhere</option>
            <option value="partial">Partially Supported</option>
            <option value="unsupported">Unsupported Everywhere</option>
          </select>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-emerald-50 p-3 rounded-md border border-emerald-100">
          <div className="text-emerald-700 font-semibold">{supportedCount}</div>
          <div className="text-sm text-emerald-600">Supported Everywhere</div>
          <div className="text-xs text-emerald-500">{Math.round((supportedCount / totalCount) * 100)}% of services</div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
          <div className="text-amber-700 font-semibold">{partialCount}</div>
          <div className="text-sm text-amber-600">Partially Supported</div>
          <div className="text-xs text-amber-500">{Math.round((partialCount / totalCount) * 100)}% of services</div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-md border border-red-100">
          <div className="text-red-700 font-semibold">{unsupportedCount}</div>
          <div className="text-sm text-red-600">Unsupported Everywhere</div>
          <div className="text-xs text-red-500">{Math.round((unsupportedCount / totalCount) * 100)}% of services</div>
        </div>
      </div>

      {/* Results sections */}
      <div className="space-y-4">
        {/* Partially Supported Services */}
        {filteredResults.partiallySupportedServices.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-amber-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('partial')}
            >
              <h3 className="font-semibold text-amber-800">
                🟡 Partially Supported Services ({filteredResults.partiallySupportedServices.length})
              </h3>
              {expandedSection === 'partial' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'partial' && (
              <div className="p-3">
                {filteredResults.partiallySupportedServices.map((item) => (
                  <ComparisonServiceItem
                    key={item.service.id}
                    service={item.service}
                    supportedRegions={item.supportedRegions}
                    unsupportedRegions={item.unsupportedRegions}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Supported Everywhere */}
        {filteredResults.supportedEverywhere.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-emerald-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('supported')}
            >
              <h3 className="font-semibold text-emerald-800">
                🟢 Supported Everywhere ({filteredResults.supportedEverywhere.length})
              </h3>
              {expandedSection === 'supported' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'supported' && (
              <div className="p-3">
                {filteredResults.supportedEverywhere.map((service) => (
                  <ComparisonServiceItem
                    key={service.id}
                    service={service}
                    supportedRegions={selectedRegions}
                    unsupportedRegions={[]}
                    isFullySupported={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Unsupported Everywhere */}
        {filteredResults.unsupportedEverywhere.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div 
              className="bg-red-50 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('unsupported')}
            >
              <h3 className="font-semibold text-red-800">
                🔴 Unsupported Everywhere ({filteredResults.unsupportedEverywhere.length})
              </h3>
              {expandedSection === 'unsupported' ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            
            {expandedSection === 'unsupported' && (
              <div className="p-3">
                {filteredResults.unsupportedEverywhere.map((service) => (
                  <ComparisonServiceItem
                    key={service.id}
                    service={service}
                    supportedRegions={[]}
                    unsupportedRegions={selectedRegions}
                    isUnsupported={true}
                  />
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
          <p className="text-sm text-gray-400 mt-1">Please select at least two regions to compare.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonResults; 