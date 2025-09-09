import React from 'react';
import { ZODIAC_SIGNS } from '../constants';
import { ZodiacSign } from '../types';

interface ZodiacWheelProps {
  selectedSign: ZodiacSign | null;
  onSelectSign: (sign: ZodiacSign) => void;
}

const ZodiacWheel: React.FC<ZodiacWheelProps> = ({ selectedSign, onSelectSign }) => {
  const wheelSize = 320; // The container size in pixels (w-80)
  const buttonSize = 64; // The button size in pixels (w-16)
  const radius = wheelSize / 2 - buttonSize / 2 - 8; // A bit of padding

  return (
    <div
      className="relative w-80 h-80 mx-auto flex items-center justify-center rounded-full"
      role="radiogroup"
      aria-label="Zodiac Signs"
    >
      {/* Decorative rings */}
      <div className="absolute w-full h-full rounded-full border-2 border-fuchsia-500/10 animate-pulse-slow"></div>
      <div className="absolute w-[98%] h-[98%] rounded-full border border-fuchsia-500/10 animate-pulse-slower"></div>
      <div className="absolute w-2/3 h-2/3 rounded-full border border-fuchsia-500/20"></div>
      <div className="absolute w-1/3 h-1/3 rounded-full border border-fuchsia-500/20"></div>

      {ZODIAC_SIGNS.map((sign, index) => {
        const angle = (index / ZODIAC_SIGNS.length) * 2 * Math.PI - Math.PI / 2; // Start Aries (index 0) at the top
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const isSelected = selectedSign === sign.name;

        return (
          <button
            key={sign.name}
            onClick={() => onSelectSign(sign.name)}
            className={`absolute flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 transform hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400
              ${
                isSelected
                  ? 'bg-fuchsia-600 shadow-lg shadow-fuchsia-500/50 ring-2 ring-fuchsia-300 z-10'
                  : 'bg-gray-700/80 backdrop-blur-sm hover:bg-fuchsia-800/80 border border-fuchsia-900/50'
              }`}
            style={{
              // We use calc() to center the button's anchor point
              top: `calc(50% - ${buttonSize / 2}px + ${y}px)`,
              left: `calc(50% - ${buttonSize / 2}px + ${x}px)`,
            }}
            role="radio"
            aria-checked={isSelected}
            aria-label={sign.name}
          >
            <span className="text-2xl" aria-hidden="true">{sign.symbol}</span>
            <span className="text-xs uppercase tracking-wider">{sign.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ZodiacWheel;
