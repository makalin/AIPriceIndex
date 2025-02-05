import { OpenAIService } from './OpenAIService';
import { AnthropicService } from './AnthropicService';
import { GoogleService } from './GoogleService';
import { MistralService } from './MistralService';
import { AlertService } from './AlertService';
import { pool } from '../models/schema';
import { PriceData } from './BaseProviderService';

export class PriceFetchingService {
  private providers = [
    new OpenAIService(),
    new AnthropicService(),
    new GoogleService(),
    new MistralService()
  ];
  private alertService: AlertService;

  constructor() {
    this.alertService = new AlertService();
  }

  async fetchAllPrices(): Promise<void> {
    try {
      for (const provider of this.providers) {
        const prices = await provider.fetchPrices();
        await this.savePricesToDatabase(provider.providerName, prices);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }

  private async savePricesToDatabase(providerName: string, prices: PriceData[]): Promise<void> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get or create provider
      const providerResult = await client.query(
        'INSERT INTO providers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
        [providerName]
      );
      const providerId = providerResult.rows[0].id;

      for (const price of prices) {
        // Get or create model
        const modelResult = await client.query(
          'INSERT INTO models (provider_id, name) VALUES ($1, $2) ON CONFLICT (provider_id, name) DO UPDATE SET name = $2 RETURNING id',
          [providerId, price.modelName]
        );
        const modelId = modelResult.rows[0].id;

        // Check for price changes before saving
        await this.alertService.checkPriceChanges(
          modelId,
          price.inputPrice,
          price.outputPrice
        );

        // Insert price point
        await client.query(
          `INSERT INTO price_points 
           (model_id, input_price_per_1k_tokens, output_price_per_1k_tokens, effective_date)
           VALUES ($1, $2, $3, $4)`,
          [modelId, price.inputPrice, price.outputPrice, price.effectiveDate]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
} 