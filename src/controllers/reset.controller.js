import { UserRepository } from '../repositories/user.repository.js';
import { sendRecoveryEmail } from '../utils/mailer.js';
import { generateToken, verifyToken } from '../utils/jwtUtils.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';

const userRepo = new UserRepository();

export const requestReset = async (req, res) => {
  const { email } = req.body;
  const user = await userRepo.getByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const token = generateToken({ email }, '1h');
  const resetLink = `http://localhost:8080/reset-password/${token}`;

  await sendRecoveryEmail(email, resetLink);
  res.json({ message: 'Correo de recuperación enviado' });
};

export const confirmReset = async (req, res) => {
  const { token } = req.params;
  const { password: newPassword } = req.body;

  try {
    const { user } = verifyToken(token);
    const existingUser = await userRepo.getByEmail(user.email);
    if (!existingUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isSame = await comparePassword(newPassword, existingUser.password);
    if (isSame) return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior' });

    const hashed = await hashPassword(newPassword);
    await userRepo.updatePassword(existingUser._id, hashed);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
