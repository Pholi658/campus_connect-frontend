import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = '100%' }) => {
  const [imageError, setImageError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.png');
  const [attempts, setAttempts] = useState(0);

  const handleImageError = () => {
    if (attempts === 0) {
      setLogoSrc('/Logo.png');
      setAttempts(1);
    } else if (attempts === 1) {
      setLogoSrc('/logo.PNG');
      setAttempts(2);
    } else {
      setImageError(true);
    }
  };

  // If there's no error, we try to load the logo.png from the public folder with case fallback.
  // This automatically uses the file they place in /public/logo.png
  if (!imageError) {
    return (
      <img
        src={logoSrc}
        alt="CampusConnect Logo"
        className={`${className} object-contain`}
        style={{ width: size, height: size }}
        onError={handleImageError}
      />
    );
  }

  // Fallback to the exquisite, self-contained SVG logo if logo.png is missing or fails to load
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circular shield / badge */}
      <rect x="10" y="10" width="80" height="80" rx="24" fill="url(#logo-grad)" />
      <rect x="13" y="13" width="74" height="74" rx="20" stroke="white" strokeWidth="2.5" strokeOpacity="0.25" fill="none" />
      
      {/* Grid of micro campus patterns */}
      <circle cx="28" cy="28" r="1.5" fill="white" fillOpacity="0.1" />
      <circle cx="72" cy="28" r="1.5" fill="white" fillOpacity="0.1" />
      <circle cx="28" cy="72" r="1.5" fill="white" fillOpacity="0.1" />
      <circle cx="72" cy="72" r="1.5" fill="white" fillOpacity="0.1" />
      
      {/* Shopping lock/handle at top of cap */}
      <path
        d="M40 37.5C40 31.5 43.5 29 50 29C56.5 29 60 31.5 60 37.5"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Graduation Cap shape */}
      <path
        d="M50 31L78 42L50 53L22 42L50 31Z"
        fill="white"
        stroke="#047857"
        strokeWidth="0.5"
      />
      
      {/* Main Cap structure border shadow */}
      <path
        d="M50 31.5L75.5 41.5L50 51.5L24.5 41.5L50 31.5Z"
        fill="none"
        stroke="#064e3b"
        strokeWidth="1.5"
        strokeOpacity="0.15"
      />

      {/* Graduation gown silhouette/base structure */}
      <path
        d="M34 46V56C34 61.5 44 66.5 50 66.5C56 66.5 66 61.5 66 56V46"
        fill="none"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Tassel hanging down */}
      <path
        d="M62 44.5L66.5 56.5"
        fill="none"
        stroke="#fcd34d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="66.5" cy="56.5" r="3.5" fill="#fcd34d" />
      
      {/* Inner Connector badge */}
      <path
        d="M43 51V57.5C43 61 50 64.5 50 64.5C50 64.5 57 61 57 57.5V51"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Color Gradients */}
      <defs>
        <linearGradient id="logo-grad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
};
