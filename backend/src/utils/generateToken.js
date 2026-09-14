import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'USER', email = '') => {
  const secret = process.env.JWT_SECRET || 'saral_jwt_secret_key_2026_super_secure_key';
  return jwt.sign({ id, role, email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
