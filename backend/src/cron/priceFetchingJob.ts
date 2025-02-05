import cron from 'node-cron';
import { PriceFetchingService } from '../services/PriceFetchingService';

const priceFetchingService = new PriceFetchingService();

// Run every day at midnight
export const startPriceFetchingJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Starting daily price fetch...');
      await priceFetchingService.fetchAllPrices();
      console.log('Daily price fetch completed successfully');
    } catch (error) {
      console.error('Error in daily price fetch:', error);
    }
  });
}; 