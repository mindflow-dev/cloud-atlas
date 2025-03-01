import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'An error occurred while fetching data.',
  onRetry 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                className="btn bg-red-100 text-red-800 hover:bg-red-200"
                onClick={onRetry}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage; 