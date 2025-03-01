import React, { useState, useEffect, useRef } from 'react';
import { AWSRegion } from '../types';
import RegionItem from './RegionItem';
import { FaFilter, FaSort, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

interface RegionListProps {
  regions: AWSRegion[];
  serviceName: string;
}

type SortField = 'name' | 'id' | 'support';
type SortDirection = 'asc' | 'desc';

const RegionList: React.FC<RegionListProps> = ({ regions, serviceName }) => {
  const [filter, setFilter] = useState<'all' | 'supported' | 'unsupported'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  
  useEffect(() => {
    const updateMaxHeight = () => {
      if (!containerRef.current) return;
      
      // Get the footer element
      const footer = document.querySelector('footer');
      if (!footer) return;
      
      // Get the container's position
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Get the footer's position from the top of the viewport
      const footerTop = footer.getBoundingClientRect().top;
      
      // Calculate available height (leave 20px margin)
      const availableHeight = footerTop - containerRect.top - 20;
      
      // Set a minimum height
      const height = Math.max(100, availableHeight);
      
      // Update the max height state
      setMaxHeight(height);
    };
    
    // Initial calculation
    updateMaxHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateMaxHeight);
    
    // Run the calculation after a short delay
    const timeoutId = setTimeout(updateMaxHeight, 100);
    
    // Also recalculate periodically to handle any dynamic content changes
    const intervalId = setInterval(updateMaxHeight, 500);
    
    return () => {
      window.removeEventListener('resize', updateMaxHeight);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);
  
  const filteredRegions = regions.filter(region => {
    if (filter === 'all') return true;
    if (filter === 'supported') return region.isSupported;
    if (filter === 'unsupported') return !region.isSupported;
    return true;
  });
  
  // Sort the filtered regions
  const sortedRegions = [...filteredRegions].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      comparison = nameA.localeCompare(nameB);
    } else if (sortField === 'id') {
      const idA = a.id.toLowerCase();
      const idB = b.id.toLowerCase();
      comparison = idA.localeCompare(idB);
    } else if (sortField === 'support') {
      comparison = (a.isSupported === b.isSupported) ? 0 : a.isSupported ? -1 : 1;
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
  
  const supportedCount = regions.filter(r => r.isSupported).length;
  const unsupportedCount = regions.filter(r => !r.isSupported).length;

  return (
    <div className="card mt-4 flex flex-col overflow-hidden" style={{ height: 'calc(100% - 16px)' }}>
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h2 className="text-xl font-semibold">
          Results for: <span className="text-aws-orange">{serviceName}</span>
        </h2>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'supported' | 'unsupported')}
          >
            <option value="all">All Regions</option>
            <option value="supported">Supported Only</option>
            <option value="unsupported">Unsupported Only</option>
          </select>
        </div>
      </div>
      
      <div className="flex mb-3 text-sm flex-shrink-0">
        <div className="mr-4">
          <span className="font-semibold text-emerald-500">{supportedCount}</span> Supported
        </div>
        <div>
          <span className="font-semibold text-red-500">{unsupportedCount}</span> Unsupported
        </div>
      </div>
      
      {/* Sorting controls */}
      <div className="flex mb-2 text-xs flex-shrink-0 border-b pb-2">
        <div className="flex-1 flex">
          <button 
            onClick={() => handleSort('name')}
            className={`flex items-center mr-3 px-2 py-1 rounded ${sortField === 'name' ? 'bg-gray-100' : ''}`}
          >
            <span className="mr-1">Name</span>
            {getSortIcon('name')}
          </button>
          
          <button 
            onClick={() => handleSort('id')}
            className={`flex items-center mr-3 px-2 py-1 rounded ${sortField === 'id' ? 'bg-gray-100' : ''}`}
          >
            <span className="mr-1">Region ID</span>
            {getSortIcon('id')}
          </button>
          
          <button 
            onClick={() => handleSort('support')}
            className={`flex items-center px-2 py-1 rounded ${sortField === 'support' ? 'bg-gray-100' : ''}`}
          >
            <span className="mr-1">Support Status</span>
            {getSortIcon('support')}
          </button>
        </div>
      </div>
      
      {sortedRegions.length > 0 ? (
        <div 
          ref={containerRef}
          className="divide-y divide-gray-100 overflow-y-auto flex-grow pr-1" 
          style={{ 
            maxHeight: maxHeight ? `${maxHeight}px` : '300px',
            overflowY: 'auto',
            scrollbarWidth: 'thin'
          }}
        >
          {sortedRegions.map(region => (
            <RegionItem key={region.id} region={region} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No regions match the selected filter.
        </div>
      )}
    </div>
  );
};

export default RegionList; 