import React from 'react';
import { PriceData } from '../services/priceService';

interface ProviderComparisonProps {
  prices: PriceData[];
}

export const ProviderComparison: React.FC<ProviderComparisonProps> = ({ prices }) => {
  const providers = [...new Set(prices.map(p => p.provider_name))];
  
  const calculateAveragePrice = (providerPrices: PriceData[]) => {
    const total = providerPrices.reduce((sum, price) => 
      sum + price.input_price_per_1k_tokens + price.output_price_per_1k_tokens, 0);
    return total / (providerPrices.length * 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {providers.map(provider => {
        const providerPrices = prices.filter(p => p.provider_name === provider);
        const avgPrice = calculateAveragePrice(providerPrices);

        return (
          <div key={provider} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{provider}</h3>
            <div className="space-y-2">
              <p>Models Available: {providerPrices.length}</p>
              <p>Average Price: ${avgPrice.toFixed(4)}/1k tokens</p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Available Models:</h4>
                <ul className="list-disc list-inside">
                  {providerPrices.map(price => (
                    <li key={price.model_name}>
                      {price.model_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 