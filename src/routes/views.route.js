import { Router } from 'express';

const router = Router();

router.get('/',(req, res) => {
  res.render('home',{})
})

router.get('/login',(req, res) => {
  res.render('login',{})
})

router.get('/register',(req, res) => {
  res.render('register',{})
})

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/reset-password/:token', (req, res) => {
  res.render('resetPassword', { token: req.params.token });
});

export default router;