import React, { useEffect, useState } from 'react';
import { priceService } from '../services/priceService';

interface PriceAlert {
  id: number;
  model_name: string;
  provider_name: string;
  percentage_change: number;
  old_input_price: number;
  new_input_price: number;
  old_output_price: number;
  new_output_price: number;
  created_at: string;
}

export const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await priceService.getRecentAlerts();
        setAlerts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Recent Price Changes</h2>
      {alerts.map(alert => (
        <div key={alert.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{alert.provider_name} - {alert.model_name}</h3>
              <p className="text-sm text-gray-600">
                Changed by {alert.percentage_change.toFixed(2)}%
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(alert.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Input Price</p>
              <p className="font-medium">
                ${alert.old_input_price} → ${alert.new_input_price}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Output Price</p>
              <p className="font-medium">
                ${alert.old_output_price} → ${alert.new_output_price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 