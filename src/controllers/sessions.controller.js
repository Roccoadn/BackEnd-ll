import { generateToken } from "../utils/jwtUtils.js";
import passport from 'passport'
import { UserDTO } from "../dto/user.dto.js";

export const loginUser = (req, res) => {
  const token = generateToken(req.user);
  res.send({ status: 'success', token });
};

export const getCurrentUser = (req, res) => {
  const dto = new UserDTO(req.user);
  res.send({ status: 'success', user: dto });
};

export const registerUser = (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).send('That email is already registered.');

    res.send({ status: 'success', message: 'User registered.', user: new UserDTO(user) });
  })(req, res, next);
};