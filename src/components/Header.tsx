import React from "react";
import { FaCloud } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="bg-aws-blue text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <FaCloud className="h-8 w-8 text-aws-orange mr-3" />
          <div>
            <h1 className="text-2xl font-bold">CloudAtlas</h1>
            <p className="text-sm text-gray-300">
              by{" "}
              <a
                href="https://mindflow.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-aws-orange transition-colors"
              >
                Mindflow
              </a>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
