import nodemailer from 'nodemailer';
import { config } from '../../config';
import { logger } from '../LoggingService';
import { PriceChange } from '../AlertService';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  async sendPriceAlert(priceChange: PriceChange) {
    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        to: config.alertEmails,
        subject: `Price Alert: ${priceChange.providerName} ${priceChange.modelName}`,
        html: this.createEmailTemplate(priceChange),
      });
      logger.info(`Price alert email sent for ${priceChange.modelName}`);
    } catch (error) {
      logger.error('Failed to send price alert email:', error);
      throw error;
    }
  }

  private createEmailTemplate(priceChange: PriceChange): string {
    return `
      <h2>Price Change Alert</h2>
      <p>Model: ${priceChange.providerName} - ${priceChange.modelName}</p>
      <p>Change: ${priceChange.percentageChange.toFixed(2)}%</p>
      <h3>Input Price</h3>
      <p>Old: $${priceChange.oldInputPrice} → New: $${priceChange.newInputPrice}</p>
      <h3>Output Price</h3>
      <p>Old: $${priceChange.oldOutputPrice} → New: $${priceChange.newOutputPrice}</p>
    `;
  }
} 