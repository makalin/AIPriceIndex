import express from 'express';
import cors from 'cors';
import { createTables } from './models/schema';
import priceRoutes from './routes/priceRoutes';
import { config } from './config';
import { startPriceFetchingJob } from './cron/priceFetchingJob';
import alertRoutes from './routes/alertRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prices', priceRoutes);
app.use('/api/alerts', alertRoutes);

// Initialize database and start server
const start = async () => {
  try {
    await createTables();
    
    // Start cron job
    startPriceFetchingJob();
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start(); 