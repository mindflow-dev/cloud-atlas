import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AWSService } from '../types';
import { awsColors } from '../utils/awsIcons';
import AWSServiceIcon from './AWSServiceIcon';

interface SearchBarProps {
  services: AWSService[];
  onServiceSelect: (service: AWSService) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ services, onServiceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<AWSService[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 300 });
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter services based on search term
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    const query = searchTerm.toLowerCase().trim();
    const filteredServices = services
      .filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.serviceCode.toLowerCase().includes(query)
      )
      // Sort alphabetically by service name
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10); // Limit to 10 suggestions
    
    setSuggestions(filteredServices);
    setSelectedIndex(-1); // Reset selection when suggestions change
  }, [searchTerm, services]);

  // Update dropdown position when it becomes visible
  useEffect(() => {
    if (showSuggestions && inputRef.current && containerRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate available space below the input
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      
      // Set maximum height for dropdown (leave 20px padding at bottom)
      const maxHeight = Math.min(350, spaceBelow - 20);
      
      setDropdownPosition({
        top: inputRect.bottom + window.scrollY,
        left: containerRect.left + window.scrollX,
        width: containerRect.width,
        maxHeight: maxHeight
      });
    }
  }, [showSuggestions, suggestions]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    // Update dropdown position on window resize or scroll
    const handlePositionUpdate = () => {
      if (showSuggestions && inputRef.current && containerRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - inputRect.bottom;
        const maxHeight = Math.min(350, spaceBelow - 20);
        
        setDropdownPosition({
          top: inputRect.bottom + window.scrollY,
          left: containerRect.left + window.scrollX,
          width: containerRect.width,
          maxHeight: maxHeight
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
    };
  }, [showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleServiceSelect = (service: AWSService) => {
    onServiceSelect(service);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleServiceSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        // If no item is selected but there are suggestions, select the first one
        handleServiceSelect(suggestions[0]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Render a suggestion item
  const renderSuggestionItem = (service: AWSService, index: number) => {
    const isSelected = index === selectedIndex;
    
    return (
      <div
        key={service.serviceCode}
        className={`flex items-center px-3 py-2 cursor-pointer ${
          isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleServiceSelect(service)}
        onMouseEnter={() => setSelectedIndex(index)}
      >
        <AWSServiceIcon service={service} size="sm" className="mr-2 flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <div className="font-medium truncate">{service.name}</div>
          <div className="text-xs text-gray-500 truncate">{service.serviceCode}</div>
        </div>
        <div className="text-xs text-white px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0" 
             style={{ backgroundColor: awsColors.navy }}>
          {service.regions.length}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="input pl-10 py-3 text-lg w-full"
          placeholder="Search AWS Service..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      {showSuggestions && searchTerm.trim() !== '' && (
        <div 
          ref={suggestionsRef}
          className="fixed bg-white shadow-lg rounded-md py-1 overflow-auto border border-gray-200 z-50"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((service, index) => renderSuggestionItem(service, index))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No services found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 