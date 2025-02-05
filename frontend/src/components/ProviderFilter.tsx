import React from 'react';
import { PriceData } from '../services/priceService';

interface ProviderFilterProps {
  prices: PriceData[];
  selectedProvider: string | null;
  onProviderSelect: (provider: string) => void;
}

export const ProviderFilter: React.FC<ProviderFilterProps> = ({ 
  prices, 
  selectedProvider, 
  onProviderSelect 
}) => {
  const providers = [...new Set(prices.map(p => p.provider_name))];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {providers.map(provider => (
        <button
          key={provider}
          onClick={() => onProviderSelect(provider)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedProvider === provider
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {provider}
        </button>
      ))}
    </div>
  );
}; 