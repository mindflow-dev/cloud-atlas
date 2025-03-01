import React, { useState, useEffect } from 'react';
import { AWSEndpointData, AWSRegion } from '../../types';
import RegionSelector from './RegionSelector';
import ComparisonResults from './ComparisonResults';
import { compareRegions, RegionComparisonResult } from '../../utils/compareRegions';
import { getRegions } from '../../api';
import { FaExchangeAlt } from 'react-icons/fa';

interface RegionComparisonProps {
  awsData: AWSEndpointData;
}

const RegionComparison: React.FC<RegionComparisonProps> = ({ awsData }) => {
  const [regions, setRegions] = useState<AWSRegion[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<RegionComparisonResult | null>(null);

  // Load regions on component mount
  useEffect(() => {
    if (awsData) {
      const allRegions = getRegions(awsData);
      setRegions(allRegions);
    }
  }, [awsData]);

  // Update comparison results when selected regions change
  useEffect(() => {
    if (selectedRegions.length >= 2) {
      const results = compareRegions(awsData, selectedRegions);
      setComparisonResults(results);
    } else {
      setComparisonResults(null);
    }
  }, [selectedRegions, awsData]);

  // Handle region selection changes
  const handleRegionsChange = (newSelectedRegions: string[]) => {
    setSelectedRegions(newSelectedRegions);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center mb-2">
          <FaExchangeAlt className="text-aws-orange mr-2" />
          <h2 className="text-xl font-semibold">Region Comparison</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Select multiple AWS regions to compare service availability across them
        </p>
        
        <RegionSelector
          regions={regions}
          selectedRegions={selectedRegions}
          onRegionsChange={handleRegionsChange}
        />
        
        {selectedRegions.length === 1 && (
          <div className="mt-2 text-amber-600 text-sm">
            Please select at least one more region to compare.
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-auto">
        {comparisonResults && selectedRegions.length >= 2 ? (
          <ComparisonResults
            results={comparisonResults}
            selectedRegions={selectedRegions}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md border">
            <p className="text-gray-500">No comparison results available.</p>
            <p className="text-sm text-gray-400 mt-1">
              {selectedRegions.length === 0
                ? "Please select at least two regions to compare."
                : selectedRegions.length === 1
                ? "Please select at least one more region to compare."
                : "Something went wrong. Please try again."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionComparison; 