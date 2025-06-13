import { verifyToken } from "../utils/jwtUtils.js";

export function authToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Token not found');

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token).user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(403).send('Invalid token');
  }
}
