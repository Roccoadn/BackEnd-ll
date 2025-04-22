import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/jwtUtils.js';
import { authToken } from '../middlewares/authToken.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.send({ status: 'success', message: 'Login route' });
});

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).send('That email is already registered.');

    res.send({ status: 'success', message: 'User registered.', user });
  })(req, res, next);
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
  const token = generateToken(req.user);
  res.send({ status: 'success', token });
});

router.get('/current', authToken, (req, res) => {
  res.send({ status: 'success', user: req.user });
});

export default router;
