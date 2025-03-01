import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FaSpinner className="animate-spin text-aws-orange h-10 w-10 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner; 