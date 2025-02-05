import React from 'react';
import { PriceData } from '../services/priceService';

interface PriceTableProps {
  prices: PriceData[];
  onModelSelect: (modelId: number, modelName: string) => void;
  searchQuery?: string;
  selectedProvider?: string | null;
}

export const PriceTable: React.FC<PriceTableProps> = ({
  prices,
  onModelSelect,
  searchQuery = '',
  selectedProvider = null,
}) => {
  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         price.provider_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = !selectedProvider || price.provider_name === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left">Provider</th>
            <th className="px-6 py-3 text-left">Model</th>
            <th className="px-6 py-3 text-right">Input Price (per 1k tokens)</th>
            <th className="px-6 py-3 text-right">Output Price (per 1k tokens)</th>
            <th className="px-6 py-3 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrices.map((price, index) => (
            <tr 
              key={index} 
              className="border-t border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => onModelSelect(price.model_id, price.model_name)}
            >
              <td className="px-6 py-4">{price.provider_name}</td>
              <td className="px-6 py-4">{price.model_name}</td>
              <td className="px-6 py-4 text-right">${price.input_price_per_1k_tokens.toFixed(4)}</td>
              <td className="px-6 py-4 text-right">${price.output_price_per_1k_tokens.toFixed(4)}</td>
              <td className="px-6 py-4">{new Date(price.effective_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredPrices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No models found matching your search criteria
        </div>
      )}
    </div>
  );
}; 