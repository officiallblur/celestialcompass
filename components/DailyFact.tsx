import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface DailyFactProps {
  topic: 'astrology' | 'astronomy' | 'chinese-astrology';
  fact: string | null;
  isLoading: boolean;
}

const DailyFact: React.FC<DailyFactProps> = ({ topic, fact, isLoading }) => {
  const getConfig = () => {
    switch (topic) {
      case 'astronomy':
        return {
          icon: '🔭',
          title: 'Daily Astronomy Fact',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-300',
        };
      case 'chinese-astrology':
        return {
          icon: '☯️',
          title: 'Daily Chinese Astrology Fact',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-300',
        };
      case 'astrology':
      default:
        return {
          icon: '🔮',
          title: 'Daily Western Astrology Fact',
          borderColor: 'border-fuchsia-500/30',
          textColor: 'text-fuchsia-300',
        };
    }
  };
  
  const config = getConfig();

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border ${config.borderColor} transition-all duration-300 hover:border-opacity-60`}>
      <h3 className={`text-xl font-semibold mb-3 flex items-center ${config.textColor}`}>
        <span className="text-2xl mr-3" aria-hidden="true">{config.icon}</span>
        {config.title}
      </h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : fact ? (
        <p className="text-gray-300">
          <span className="font-bold text-white">Did you know?</span>
          <span className="italic ml-1">"{fact}"</span>
        </p>
      ) : (
        <p className="text-gray-500">Could not load today's fact.</p>
      )}
    </div>
  );
};

export default DailyFact;