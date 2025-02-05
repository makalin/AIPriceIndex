import { WebClient } from '@slack/web-api';
import { config } from '../../config';
import { logger } from '../LoggingService';
import { PriceChange } from '../AlertService';

export class SlackService {
  private client: WebClient;
  private channel: string;

  constructor() {
    this.client = new WebClient(config.slack.token);
    this.channel = config.slack.channel;
  }

  async sendPriceAlert(priceChange: PriceChange) {
    try {
      await this.client.chat.postMessage({
        channel: this.channel,
        text: this.createMessage(priceChange),
        blocks: this.createBlocks(priceChange),
      });
      logger.info(`Slack alert sent for ${priceChange.modelName}`);
    } catch (error) {
      logger.error('Failed to send Slack alert:', error);
      throw error;
    }
  }

  private createMessage(priceChange: PriceChange): string {
    return `Price Alert: ${priceChange.providerName}'s ${priceChange.modelName} prices changed by ${priceChange.percentageChange.toFixed(2)}%`;
  }

  private createBlocks(priceChange: PriceChange): any[] {
    return [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Price Change Alert',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Provider:*\n${priceChange.providerName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Model:*\n${priceChange.modelName}`,
          },
        ],
      },
      // Add more blocks for price details
    ];
  }
} 