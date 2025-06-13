import jwt from 'jsonwebtoken';

const SECRET_KEY = 'coderSecretKey2025';

export function generateToken(user, expiresIn = '24h') {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}