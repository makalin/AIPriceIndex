import axios from 'axios';
import { config } from '../config';

export interface PriceData {
  provider_name: string;
  model_name: string;
  input_price_per_1k_tokens: number;
  output_price_per_1k_tokens: number;
  effective_date: string;
}

export interface PriceHistory {
  input_price_per_1k_tokens: number;
  output_price_per_1k_tokens: number;
  effective_date: string;
}

const api = axios.create({
  baseURL: config.apiUrl,
});

export const priceService = {
  getCurrentPrices: async (): Promise<PriceData[]> => {
    const response = await api.get('/prices/current');
    return response.data;
  },

  getPriceHistory: async (modelId: number, startDate: string, endDate: string): Promise<PriceHistory[]> => {
    const response = await api.get('/prices/history', {
      params: { modelId, startDate, endDate }
    });
    return response.data;
  },
}; 