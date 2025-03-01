import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AWSRegion } from '../types';

interface RegionItemProps {
  region: AWSRegion;
}

const RegionItem: React.FC<RegionItemProps> = ({ region }) => {
  return (
    <div className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
      <div className="mr-3">
        {region.isSupported ? (
          <FaCheckCircle className="text-emerald-500 h-5 w-5" />
        ) : (
          <FaTimesCircle className="text-red-500 h-5 w-5" />
        )}
      </div>
      <div>
        <div className="font-medium">{region.name}</div>
        <div className="text-sm text-gray-500">{region.id}</div>
      </div>
    </div>
  );
};

export default RegionItem; 