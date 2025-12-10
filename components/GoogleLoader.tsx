import React from 'react';

interface GoogleLoaderProps {
  size?: number;
  className?: string;
}

const GoogleLoader: React.FC<GoogleLoaderProps> = ({ size = 40, className = '' }) => {
  return (
    <svg
      className={`google-loader ${className}`}
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className="google-loader-circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
};

export default GoogleLoader;
