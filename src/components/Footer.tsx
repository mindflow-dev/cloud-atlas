import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-2 mt-auto flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <div className="mb-1 md:mb-0">
            &copy; {new Date().getFullYear()} CloudAtlas by Mindflow - AWS Region Service Availability Explorer
          </div>
          <div className="flex items-center">
            <span className="mr-2">Data sourced directly from AWS</span>
            <a 
              href="https://github.com/mindflow-dev/cloud-atlas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-aws-blue hover:text-aws-orange transition-colors flex items-center"
            >
              <FaGithub className="h-4 w-4 mr-1" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 