import { BaseProviderService, PriceData } from './BaseProviderService';
import { config } from '../config';

export class GoogleService extends BaseProviderService {
  protected providerName = 'Google';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = config.googleApiKey;
  }

  async fetchPrices(): Promise<PriceData[]> {
    try {
      return [
        {
          modelName: 'gemini-pro',
          inputPrice: 0.00025,
          outputPrice: 0.0005,
          effectiveDate: new Date()
        },
        {
          modelName: 'gemini-ultra',
          inputPrice: 0.001,
          outputPrice: 0.002,
          effectiveDate: new Date()
        }
      ];
    } catch (error) {
      console.error('Error fetching Google prices:', error);
      throw error;
    }
  }
} 