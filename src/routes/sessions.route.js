import express from 'express';
import passport from 'passport';
import { authToken } from '../middlewares/authToken.js';
import { loginUser, getCurrentUser, registerUser } from '../controllers/sessions.controller.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.send({ status: 'success', message: 'Login route' });
});

router.post('/register', registerUser);

router.post('/login', passport.authenticate('login', { session: false }), loginUser);

router.get('/current', authToken, getCurrentUser);

export default router;
