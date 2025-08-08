import { JWT } from '@/constants';
import jwt from 'jsonwebtoken';

export default class Generator {
    // Generate JWT token
    static generateToken = (userId: string, role: string) => {
    return jwt.sign(
      { id: userId, role },
      JWT.SECRET!,
      { expiresIn: '24h' }
    );
  };
}