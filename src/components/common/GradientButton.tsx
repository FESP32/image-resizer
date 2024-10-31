import React from 'react';

type GradientVariant = 'original' | 'minty-blue' | 'sky-blue';

interface Props {
  children: React.ReactNode;
  variant?: GradientVariant;
  width?: string;
  onClick?: () => void; // Add the onClick prop
}

const GradientButton: React.FC<Props> = ({
  children,
  variant = 'original',
  width = 'full',
  onClick,
}) => {
  const gradientClasses: Record<GradientVariant, string> = {
    original: 'from-[#00D9F9] to-[#02ADF8]', // Original main gradient
    'minty-blue': 'from-[#00C9E0] to-[#02A0E0]', // Slightly cooler variant
    'sky-blue': 'from-[#00B8E6] to-[#0192D8]', // Sky blue with a hint of depth
  };

  return (
    <button
      className={`px-6 py-3 w-${width} rounded-full bg-gradient-to-r ${gradientClasses[variant]} transform font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg focus:outline-none`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default GradientButton;
