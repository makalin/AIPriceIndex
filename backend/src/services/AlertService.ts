import { pool } from '../models/schema';
import { config } from '../config';
import { EmailService } from './notifications/EmailService';
import { SlackService } from './notifications/SlackService';
import { logger } from './LoggingService';

interface PriceChange {
  modelId: number;
  modelName: string;
  providerName: string;
  oldInputPrice: number;
  newInputPrice: number;
  oldOutputPrice: number;
  newOutputPrice: number;
  percentageChange: number;
}

export class AlertService {
  private readonly emailService: EmailService;
  private readonly slackService: SlackService;
  private readonly thresholdPercentage: number;

  constructor() {
    this.emailService = new EmailService();
    this.slackService = new SlackService();
    this.thresholdPercentage = Number(config.alertThresholdPercentage) || 10;
  }

  async checkPriceChanges(modelId: number, newInputPrice: number, newOutputPrice: number): Promise<void> {
    const previousPrices = await this.getLatestPrices(modelId);
    
    if (!previousPrices) {
      return; // No previous prices to compare
    }

    const inputPriceChange = this.calculatePercentageChange(
      previousPrices.input_price_per_1k_tokens,
      newInputPrice
    );

    const outputPriceChange = this.calculatePercentageChange(
      previousPrices.output_price_per_1k_tokens,
      newOutputPrice
    );

    const maxChange = Math.max(Math.abs(inputPriceChange), Math.abs(outputPriceChange));

    if (maxChange >= this.thresholdPercentage) {
      await this.createAlert({
        modelId,
        modelName: previousPrices.model_name,
        providerName: previousPrices.provider_name,
        oldInputPrice: previousPrices.input_price_per_1k_tokens,
        newInputPrice,
        oldOutputPrice: previousPrices.output_price_per_1k_tokens,
        newOutputPrice,
        percentageChange: maxChange
      });
    }
  }

  private async getLatestPrices(modelId: number) {
    const result = await pool.query(`
      SELECT 
        pp.input_price_per_1k_tokens,
        pp.output_price_per_1k_tokens,
        m.name as model_name,
        p.name as provider_name
      FROM price_points pp
      JOIN models m ON pp.model_id = m.id
      JOIN providers p ON m.provider_id = p.id
      WHERE pp.model_id = $1
      ORDER BY pp.effective_date DESC
      LIMIT 1
    `, [modelId]);

    return result.rows[0];
  }

  private calculatePercentageChange(oldPrice: number, newPrice: number): number {
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  private async createAlert(priceChange: PriceChange): Promise<void> {
    await pool.query(`
      INSERT INTO price_alerts 
      (model_id, percentage_change, old_input_price, new_input_price, old_output_price, new_output_price)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      priceChange.modelId,
      priceChange.percentageChange,
      priceChange.oldInputPrice,
      priceChange.newInputPrice,
      priceChange.oldOutputPrice,
      priceChange.newOutputPrice
    ]);

    // Log the alert
    console.log(`Price Alert: ${priceChange.providerName}'s ${priceChange.modelName} prices changed by ${priceChange.percentageChange.toFixed(2)}%`);
    
    // Here you could add additional notification methods:
    // - Send emails
    // - Push notifications
    // - Webhook calls
    // - Slack notifications
    await this.sendNotifications(priceChange);
  }

  private async sendNotifications(priceChange: PriceChange): Promise<void> {
    try {
      await Promise.all([
        this.emailService.sendPriceAlert(priceChange),
        this.slackService.sendPriceAlert(priceChange),
      ]);
      logger.info('All notifications sent successfully');
    } catch (error) {
      logger.error('Error sending notifications:', error);
    }
  }
} 