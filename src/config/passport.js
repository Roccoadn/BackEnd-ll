import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

const userRepo = new UserRepository();

passport.use(
  'register',
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const { first_name, last_name, age } = req.body;
        const existingUser = await userRepo.getByEmail(email);
        if (existingUser) {
          return done(null, false, { message: 'Email ya registrado' });
        }

        const hashed = await hashPassword(password);
        const newUser = await userRepo.create({
          first_name,
          last_name,
          email,
          age,
          role: 'user',
          password: hashed
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await userRepo.getByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
