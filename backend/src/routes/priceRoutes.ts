import { Router } from 'express';
import { PriceController } from '../controllers/PriceController';

const router = Router();
const priceController = new PriceController();

router.get('/current', priceController.getCurrentPrices);
router.get('/history', priceController.getPriceHistory);
router.get('/providers', priceController.getProviders);
router.get('/models/:providerId', priceController.getModelsByProvider);

export default router; 