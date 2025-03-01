import React, { useEffect, useRef, useState } from 'react';
import { AWSService } from '../types';
import { FaSort, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import { awsColors } from '../utils/awsIcons';
import { getRegionName } from '../api';
import AWSServiceIcon from './AWSServiceIcon';

interface ResultsListProps {
  selectedService: AWSService | null;
}

type SortField = 'name' | 'id';
type SortDirection = 'asc' | 'desc';

// Group regions by continent for better organization
const getContinentFromRegion = (regionId: string): string => {
  if (regionId.startsWith('us-') || regionId.startsWith('ca-') || regionId.startsWith('mx-')) return 'North America';
  if (regionId.startsWith('sa-')) return 'South America';
  if (regionId.startsWith('eu-')) return 'Europe';
  if (regionId.startsWith('ap-')) return 'Asia Pacific';
  if (regionId.startsWith('af-')) return 'Africa';
  if (regionId.startsWith('me-')) return 'Middle East';
  if (regionId.startsWith('cn-')) return 'China';
  if (regionId.startsWith('il-')) return 'Middle East';
  return 'Other';
};

const ResultsList: React.FC<ResultsListProps> = ({ selectedService }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Calculate and set the max height when the component mounts or when selectedService changes
  useEffect(() => {
    const updateMaxHeight = () => {
      if (!containerRef.current) return;
      
      // Get the footer element
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      // Get the container's position
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the distance from the top of the viewport to the top of the container
      const containerTop = containerRect.top;
      
      // Get the footer's position from the top of the viewport
      const footerTop = footer.getBoundingClientRect().top;
      
      // Calculate available height (leave 20px margin)
      // This ensures the results list ends before the footer starts
      const availableHeight = footerTop - containerTop - 20;
      
      // Set a minimum height to ensure usability, but cap it to available space
      const height = Math.max(100, availableHeight);
      
      // Update the max height state
      setMaxHeight(height);
    };
    
    // Initial calculation
    updateMaxHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateMaxHeight);
    
    // Run the calculation after a short delay to ensure all elements are properly rendered
    const timeoutId = setTimeout(updateMaxHeight, 100);
    
    // Also recalculate periodically to handle any dynamic content changes
    const intervalId = setInterval(updateMaxHeight, 500);
    
    return () => {
      window.removeEventListener('resize', updateMaxHeight);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [selectedService]);

  // Add CSS for the fallback icon
  useEffect(() => {
    // Add a style element to the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .show-fallback .fallback-icon {
        display: flex !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!selectedService) {
    return (
      <div className="mt-8 text-center text-gray-500">
        Select a service to see available regions
      </div>
    );
  }

  // Sort regions based on the selected sort field and direction
  const sortedRegions = [...selectedService.regions].map(regionId => {
    // Create a region object with proper name and continent
    return {
      id: regionId,
      name: getRegionName(regionId),
      continent: getContinentFromRegion(regionId)
    };
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'id') {
      comparison = a.id.localeCompare(b.id);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortAlphaDown className="text-aws-orange" /> : 
      <FaSortAlphaUp className="text-aws-orange" />;
  };

  return (
    <div className="mt-6 mb-2">
      <div className="flex items-center mb-3 flex-shrink-0">
        <AWSServiceIcon service={selectedService} size="md" className="mr-3" />
        <div>
          <h2 className="text-2xl font-bold">{selectedService.name}</h2>
          <div className="text-xs text-gray-500">
            Service Code: {selectedService.serviceCode}
          </div>
        </div>
        <span className="ml-auto text-sm text-white px-2 py-1 rounded-full" 
              style={{ backgroundColor: awsColors.navy }}>
          {selectedService.regions.length} regions
        </span>
      </div>
      
      {/* Sorting controls */}
      <div className="flex mb-2 text-xs flex-shrink-0 border-b pb-2">
        <div className="flex-1 flex">
          <button 
            onClick={() => handleSort('name')}
            className={`flex items-center mr-3 px-2 py-1 rounded ${sortField === 'name' ? 'bg-gray-100' : ''}`}
          >
            <span className="mr-1">Region Name</span>
            {getSortIcon('name')}
          </button>
          
          <button 
            onClick={() => handleSort('id')}
            className={`flex items-center px-2 py-1 rounded ${sortField === 'id' ? 'bg-gray-100' : ''}`}
          >
            <span className="mr-1">Region ID</span>
            {getSortIcon('id')}
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-2"
        style={{ 
          maxHeight: maxHeight ? `${maxHeight}px` : '300px',
          overflowY: 'auto',
          scrollbarWidth: 'thin'
        }}
      >
        {sortedRegions.map((region) => (
          <div 
            key={region.id} 
            className="bg-white p-3 rounded-lg shadow border border-gray-200"
          >
            <h3 className="font-medium text-lg">{region.name}</h3>
            <p className="text-gray-500">{region.id}</p>
            <div className="mt-1 text-xs text-gray-500">
              {region.continent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList; 