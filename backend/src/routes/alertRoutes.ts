import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';

const router = Router();
const alertController = new AlertController();

router.get('/recent', alertController.getRecentAlerts);

export default router; 