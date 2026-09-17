import React from 'react';

interface CrystallLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CrystallLogo: React.FC<CrystallLogoProps> = ({ 
  className = '', 
  size = 16,
  glow = false
}) => {
  // Stroke width optimized for razor-sharp rendering at all dimensions:
  // At 10-14px: 4.8 for thick, clear lines
  // At 15-24px: 4.5 for balanced proportions
  // At >24px: 4.0 for elegant vector fidelity
  const strokeWidth = size <= 14 ? 5.0 : size <= 24 ? 4.6 : 4.0;

  return (
    <svg 
      className={className} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        filter: glow ? 'drop-shadow(0 0 10px var(--accent-glow))' : 'none',
        flexShrink: 0
      }}
      viewBox="17 11 66 70" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Center Crystal Pillar */}
        <polygon points="50,15 65,35 59,78 41,78 35,35" />
        <line x1="50" y1="15" x2="50" y2="78" />
        <line x1="35" y1="35" x2="50" y2="45" />
        <line x1="65" y1="35" x2="50" y2="45" />

        {/* Left Crystal Pillar */}
        <polygon points="33,39 22,46 36,78 44,77 37,51" />
        <line x1="22" y1="46" x2="41" y2="77" />
        <line x1="22" y1="46" x2="31" y2="57" />
        <line x1="37" y1="51" x2="31" y2="57" />

        {/* Right Crystal Pillar */}
        <polygon points="67,39 78,46 64,78 56,77 63,51" />
        <line x1="78" y1="46" x2="59" y2="77" />
        <line x1="78" y1="46" x2="69" y2="57" />
        <line x1="63" y1="51" x2="69" y2="57" />
      </g>
    </svg>
  );
};
