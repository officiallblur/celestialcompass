import React from 'react';
import { PLANET_STYLES } from '../assets/planetImages';

interface PlanetProps {
  planetName: string;
  className?: string;
}

const Planet: React.FC<PlanetProps> = ({ planetName, className = '' }) => {
  const style = PLANET_STYLES[planetName] || {};
  
  return (
    <div
      className={`rounded-full animate-[spin-slow_20s_linear_infinite] ${className}`}
      style={{ ...style, backgroundSize: '150% 150%', backgroundPosition: 'center' }}
      aria-label={planetName}
      role="img"
    ></div>
  );
};

export default Planet;
