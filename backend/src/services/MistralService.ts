import { BaseProviderService, PriceData } from './BaseProviderService';
import { config } from '../config';

export class MistralService extends BaseProviderService {
  protected providerName = 'Mistral';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = config.mistralApiKey;
  }

  async fetchPrices(): Promise<PriceData[]> {
    try {
      return [
        {
          modelName: 'mistral-large',
          inputPrice: 0.007,
          outputPrice: 0.024,
          effectiveDate: new Date()
        },
        {
          modelName: 'mistral-medium',
          inputPrice: 0.002,
          outputPrice: 0.006,
          effectiveDate: new Date()
        },
        {
          modelName: 'mistral-small',
          inputPrice: 0.0002,
          outputPrice: 0.0006,
          effectiveDate: new Date()
        }
      ];
    } catch (error) {
      console.error('Error fetching Mistral prices:', error);
      throw error;
    }
  }
} 