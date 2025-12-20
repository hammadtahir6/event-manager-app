import React from 'react';

interface LogoProps {
  className?: string;
  invert?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", invert = false }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`overflow-visible ${className}`}
    >
      {/* Ground Line */}
      <path 
        d="M1 21H23" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />

      {/* Heart-Shaped Venue Structure (Background) */}
      <path 
        d="M3 21V10C3 5 7.5 2 12 5.5C16.5 2 21 5 21 10V21" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Entrance Archway */}
      <path 
        d="M9 21V14C9 12.5 10.5 11.5 12 11.5C13.5 11.5 15 12.5 15 14V21" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeOpacity="0.4" 
      />

      {/* Multiple People Entering (Foreground) - Maximized */}
      
      {/* Left Person */}
      <g>
        <circle cx="5" cy="13.5" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.5" />
        <path d="M2 21C2 17 3.5 15.5 5 15.5C6.5 15.5 8 17 8 21" fill="currentColor" stroke="white" strokeWidth="0.5" />
      </g>

      {/* Right Person */}
      <g>
        <circle cx="19" cy="13.5" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.5" />
        <path d="M16 21C16 17 17.5 15.5 19 15.5C20.5 15.5 22 17 22 21" fill="currentColor" stroke="white" strokeWidth="0.5" />
      </g>

      {/* Center Person (Leading) */}
      <g>
        <circle cx="12" cy="11.5" r="3.5" fill="currentColor" stroke="white" strokeWidth="0.5" />
        <path d="M7 21C7 16 9 13.5 12 13.5C15 13.5 17 16 17 21" fill="currentColor" stroke="white" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

export default Logo;