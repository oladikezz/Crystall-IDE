import React from 'react';
import logoWhite from '../assets/logo_white.png';
import logoOrange from '../assets/logo_orange.png';

interface CrystallLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  variant?: 'white' | 'orange';
}

export const CrystallLogo: React.FC<CrystallLogoProps> = ({ 
  className = '', 
  size = 16,
  glow = false,
  variant = 'white'
}) => {
  const src = variant === 'orange' ? logoOrange : logoWhite;

  return (
    <img 
      src={src} 
      alt="Crystall Logo"
      className={className} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        objectFit: 'contain',
        filter: glow ? 'drop-shadow(0 0 10px rgba(255, 107, 0, 0.6))' : 'none',
        flexShrink: 0,
        display: 'block',
        userSelect: 'none'
      }}
      draggable={false}
    />
  );
};
