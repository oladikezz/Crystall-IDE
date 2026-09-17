import React from 'react';

interface CrystallLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  faceted?: boolean;
  strokeWidth?: number;
}

export const CrystallLogo: React.FC<CrystallLogoProps> = ({ 
  className = '', 
  size = 16,
  glow = false,
  faceted = true,
  strokeWidth
}) => {
  const dynamicStroke = strokeWidth ?? (size <= 12 ? 4.8 : size <= 18 ? 4.2 : size <= 48 ? 3.8 : 2.8);

  return (
    <svg 
      className={className} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        filter: glow ? 'drop-shadow(0 0 12px var(--accent-glow))' : 'none',
        flexShrink: 0
      }}
      viewBox="17 11 66 70" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3D Semi-transparent facet fills for jewel luster */}
      {faceted && (
        <g fill="currentColor" stroke="none">
          {/* Left crystal facets */}
          <polygon points="33,39 22,46 31,57 37,51" fillOpacity={0.25} />
          <polygon points="22,46 36,78 41,77 31,57" fillOpacity={0.15} />
          <polygon points="37,51 31,57 41,77 44,77" fillOpacity={0.35} />

          {/* Center crystal facets */}
          <polygon points="50,15 35,35 50,45" fillOpacity={0.28} />
          <polygon points="50,15 65,35 50,45" fillOpacity={0.42} />
          <polygon points="35,35 50,45 50,78 41,78" fillOpacity={0.2} />
          <polygon points="65,35 50,45 50,78 59,78" fillOpacity={0.32} />

          {/* Right crystal facets */}
          <polygon points="67,39 78,46 69,57 63,51" fillOpacity={0.4} />
          <polygon points="78,46 64,78 59,77 69,57" fillOpacity={0.25} />
          <polygon points="63,51 69,57 59,77 56,77" fillOpacity={0.15} />
        </g>
      )}

      {/* Structural crystal facets and seams */}
      <g 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={dynamicStroke} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Center Crystal */}
        <polygon points="50,15 65,35 59,78 41,78 35,35" />
        <line x1="50" y1="15" x2="50" y2="78" />
        <line x1="35" y1="35" x2="50" y2="45" />
        <line x1="65" y1="35" x2="50" y2="45" />

        {/* Left Crystal */}
        <polygon points="33,39 22,46 36,78 44,77 37,51" />
        <line x1="22" y1="46" x2="41" y2="77" />
        <line x1="22" y1="46" x2="31" y2="57" />
        <line x1="37" y1="51" x2="31" y2="57" />

        {/* Right Crystal */}
        <polygon points="67,39 78,46 64,78 56,77 63,51" />
        <line x1="78" y1="46" x2="59" y2="77" />
        <line x1="78" y1="46" x2="69" y2="57" />
        <line x1="63" y1="51" x2="69" y2="57" />
      </g>
    </svg>
  );
};
