import { BaseProviderService, PriceData } from './BaseProviderService';
import { config } from '../config';

export class AnthropicService extends BaseProviderService {
  protected providerName = 'Anthropic';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = config.anthropicApiKey;
  }

  async fetchPrices(): Promise<PriceData[]> {
    try {
      // Current Claude models and their prices
      return [
        {
          modelName: 'claude-3-opus',
          inputPrice: 0.015,
          outputPrice: 0.075,
          effectiveDate: new Date()
        },
        {
          modelName: 'claude-3-sonnet',
          inputPrice: 0.003,
          outputPrice: 0.015,
          effectiveDate: new Date()
        },
        {
          modelName: 'claude-2.1',
          inputPrice: 0.008,
          outputPrice: 0.024,
          effectiveDate: new Date()
        }
      ];
    } catch (error) {
      console.error('Error fetching Anthropic prices:', error);
      throw error;
    }
  }
} 