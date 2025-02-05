import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../models/schema';
import { config } from '../config';

export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = config.jwtSecret;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET must be defined');
    }
  }

  async authenticateUser(email: string, password: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.jwtSecret);
  }
} 