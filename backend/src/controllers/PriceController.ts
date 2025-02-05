import { Request, Response } from 'express';
import { pool } from '../models/schema';

export class PriceController {
  async getCurrentPrices(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT 
          p.name as provider_name,
          m.name as model_name,
          pp.input_price_per_1k_tokens,
          pp.output_price_per_1k_tokens,
          pp.effective_date
        FROM price_points pp
        JOIN models m ON pp.model_id = m.id
        JOIN providers p ON m.provider_id = p.id
        WHERE pp.effective_date = (
          SELECT MAX(effective_date)
          FROM price_points pp2
          WHERE pp2.model_id = pp.model_id
        )
      `);
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prices' });
    }
  }

  async getPriceHistory(req: Request, res: Response) {
    const { modelId, startDate, endDate } = req.query;
    
    try {
      const result = await pool.query(`
        SELECT 
          input_price_per_1k_tokens,
          output_price_per_1k_tokens,
          effective_date
        FROM price_points
        WHERE model_id = $1
          AND effective_date BETWEEN $2 AND $3
        ORDER BY effective_date DESC
      `, [modelId, startDate, endDate]);
      
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  }
} 