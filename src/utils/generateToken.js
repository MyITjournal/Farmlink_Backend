import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generate a JWT for a given payload.
 * Payload should include at minimum: { id, role, email }
 */
const generateToken = (payload, opts = { expiresIn: '7d' }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, opts);
};

export default generateToken;
