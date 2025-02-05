import { useEffect, useState } from 'react';
import { PriceTable } from '../components/PriceTable';
import { PriceChart } from '../components/PriceChart';
import { PriceComparisonChart } from '../components/PriceComparisonChart';
import { ProviderComparison } from '../components/ProviderComparison';
import { PriceAlerts } from '../components/PriceAlerts';
import { priceService, PriceData, PriceHistory } from '../services/priceService';
import { ProviderFilter } from '../components/ProviderFilter';
import { SearchBar } from '../components/SearchBar';

export default function Home() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await priceService.getCurrentPrices();
        setPrices(data);
        if (data.length > 0) {
          setSelectedProvider(data[0].provider_name);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleModelSelect = async (modelId: number, modelName: string) => {
    setSelectedModel(modelName);
    const endDate = new Date().toISOString();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    
    try {
      const data = await priceService.getPriceHistory(modelId, startDate.toISOString(), endDate);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Model Price Index</h1>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-12">
          <div>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <ProviderFilter
              prices={prices}
              selectedProvider={selectedProvider}
              onProviderSelect={setSelectedProvider}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Prices</h2>
              <PriceTable 
                prices={prices} 
                onModelSelect={handleModelSelect}
                searchQuery={searchQuery}
                selectedProvider={selectedProvider}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Price Alerts</h2>
              <PriceAlerts />
            </div>
          </div>

          {selectedModel && history.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Price History</h2>
              <PriceChart history={history} modelName={selectedModel} />
            </div>
          )}

          {selectedProvider && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Provider Comparison</h2>
              <PriceComparisonChart 
                prices={prices} 
                provider={selectedProvider} 
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Provider Overview</h2>
            <ProviderComparison prices={prices} />
          </div>
        </div>
      )}
    </div>
  );
} 