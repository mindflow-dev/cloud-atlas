import React, { useState, useEffect, useRef } from 'react';
import { AWSRegion } from '../../types';
import { FaGlobe, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { getRegionName } from '../../api';

interface RegionSelectorProps {
  regions: AWSRegion[];
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  regions,
  selectedRegions,
  onRegionsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter regions based on search term
  const filteredRegions = regions.filter(region => {
    const searchLower = searchTerm.toLowerCase();
    return (
      region.name.toLowerCase().includes(searchLower) ||
      region.id.toLowerCase().includes(searchLower) ||
      getRegionName(region.id).toLowerCase().includes(searchLower)
    );
  });

  // Sort regions by name
  const sortedRegions = [...filteredRegions].sort((a, b) => {
    return getRegionName(a.id).localeCompare(getRegionName(b.id));
  });

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle region selection
  const toggleRegion = (regionId: string) => {
    if (selectedRegions.includes(regionId)) {
      onRegionsChange(selectedRegions.filter(id => id !== regionId));
    } else {
      onRegionsChange([...selectedRegions, regionId]);
    }
  };

  // Clear all selected regions
  const clearSelection = () => {
    onRegionsChange([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected regions display / dropdown trigger */}
      <div
        className="flex items-center justify-between p-3 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FaGlobe className="text-aws-orange mr-2" />
          <span className="font-medium">
            {selectedRegions.length === 0
              ? 'Select regions to compare'
              : `${selectedRegions.length} region${selectedRegions.length !== 1 ? 's' : ''} selected`}
          </span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
          {/* Search and actions */}
          <div className="p-2 border-b sticky top-0 bg-white z-10">
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {selectedRegions.length} of {regions.length} selected
              </span>
              {selectedRegions.length > 0 && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Region list */}
          <div className="overflow-y-auto flex-grow">
            {sortedRegions.length > 0 ? (
              sortedRegions.map((region) => (
                <div
                  key={region.id}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                    selectedRegions.includes(region.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRegion(region.id);
                  }}
                >
                  <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                    selectedRegions.includes(region.id) 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedRegions.includes(region.id) && (
                      <FaCheck className="text-white text-xs" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{getRegionName(region.id)}</div>
                    <div className="text-xs text-gray-500">{region.id}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No regions match your search
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector; 