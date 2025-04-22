import passport from 'passport';
import local from 'passport-local';
import UserModel from '../models/users.models.js';
import { createHash, isValidPassword } from '../utils/passwordUtils.js';

const LocalStrategy = local.Strategy;

passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const { first_name, last_name, age } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) return done(null, false);

  const newUser = await UserModel.create({
    first_name, last_name, email, age,
    password: createHash(password)
  });
  return done(null, newUser);
}));

passport.use('login', new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  const existingUser = await UserModel.findOne({ email });
  if (!existingUser || !isValidPassword(existingUser, password)) return done(null, false);
  return done(null, existingUser);
}));