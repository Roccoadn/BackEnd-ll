import jwt from 'jsonwebtoken';

const SECRET_KEY = 'coderSecretKey2025';

export function generateToken(user) {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: '24h' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}