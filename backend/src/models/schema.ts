import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS providers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      website_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS models (
      id SERIAL PRIMARY KEY,
      provider_id INTEGER REFERENCES providers(id),
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider_id, name)
    );

    CREATE TABLE IF NOT EXISTS price_points (
      id SERIAL PRIMARY KEY,
      model_id INTEGER REFERENCES models(id),
      input_price_per_1k_tokens DECIMAL(10, 6),
      output_price_per_1k_tokens DECIMAL(10, 6),
      effective_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS price_alerts (
      id SERIAL PRIMARY KEY,
      model_id INTEGER REFERENCES models(id),
      percentage_change DECIMAL(10, 2),
      old_input_price DECIMAL(10, 6),
      new_input_price DECIMAL(10, 6),
      old_output_price DECIMAL(10, 6),
      new_output_price DECIMAL(10, 6),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export { pool, createTables }; 