import React from 'react';

interface Props {
  children: React.ReactNode;
  height?: string;
}

const Section: React.FC<Props> = ({ children, height }) => {
  return (
    <div className={`h-${height ? height : 'screen'} container mx-auto my-6 w-screen`}>
      {children}
    </div>
  );
};

export default Section;
