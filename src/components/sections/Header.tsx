import React from 'react';
import { GiResize } from 'react-icons/gi';

const Header: React.FC = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2">
        <h1 className="text-4xl font-bold">Image Resizer</h1>
        <GiResize className="h-6 w-6" />
      </div>
      <p className="text-md text-gray-500">Easily resize your images in one click </p>
    </div>
  );
};

export default Header;
