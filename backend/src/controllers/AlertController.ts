import { Request, Response } from 'express';
import { pool } from '../models/schema';

export class AlertController {
  async getRecentAlerts(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT 
          pa.*,
          m.name as model_name,
          p.name as provider_name
        FROM price_alerts pa
        JOIN models m ON pa.model_id = m.id
        JOIN providers p ON m.provider_id = p.id
        ORDER BY pa.created_at DESC
        LIMIT 50
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }
} 