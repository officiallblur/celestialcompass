import React from 'react';
import { PLANETS } from '../constants';
import Planet from './Planet';

// Simplified relative sizes for visual representation (not to scale)
const PLANET_SIZES: Record<string, string> = {
  Mercury: 'w-3 h-3',
  Venus: 'w-5 h-5',
  Earth: 'w-5 h-5',
  Mars: 'w-4 h-4',
  Jupiter: 'w-10 h-10',
  Saturn: 'w-9 h-9',
  Uranus: 'w-7 h-7',
  Neptune: 'w-7 h-7',
};

// Simplified relative distances for layout (not to scale)
const PLANET_DISTANCES = [
  'left-[12%]', 'left-[20%]', 'left-[29%]', 'left-[38%]',
  'left-[49%]', 'left-[63%]', 'left-[79%]', 'left-[91%]',
];

const SolarSystemMap: React.FC = () => {
  return (
    <div className="relative w-full h-48 flex items-center bg-black/20 rounded-lg overflow-hidden p-4">
      {/* Sun */}
      <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_10px_rgba(251,191,36,0.5)]">
        <div className="w-20 h-20 bg-yellow-300 rounded-full blur-sm"></div>
        <span className="absolute text-white font-bold text-lg">Sun</span>
      </div>
      
      {/* Faint background stars */}
      <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '25px 25px'}}></div>

      {/* Planets */}
      {PLANETS.map((planet, index) => (
        <div
          key={planet}
          className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform duration-300 hover:scale-125 z-10 ${PLANET_DISTANCES[index]}`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {/* Orbit line */}
          <div className="absolute bottom-1/2 left-1/2 w-px h-24 bg-amber-500/10 -translate-x-1/2"></div>
        
          <div className="relative flex justify-center items-center">
            <Planet
              planetName={planet}
              className={`shadow-lg shadow-black/50 ${PLANET_SIZES[planet]}`}
            />
            {/* Saturn's Ring */}
            {planet === 'Saturn' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[80%] border-2 border-amber-200/50 rounded-[50%] rotate-[-30deg]"></div>
            )}
          </div>
          <span className="absolute top-full mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900/70 px-2 py-0.5 rounded">
            {planet}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SolarSystemMap;