import { Router } from 'express';
import { UserRepository } from '../repositories/user.repository.js';
import { authToken } from '../middlewares/authToken.js';
import { checkRole } from '../middlewares/roleAuthorization.js';
import { UserDTO } from '../dto/user.dto.js';

const router = Router();
const userRepo = new UserRepository();

router.get('/', authToken, checkRole('admin'), async (_req, res) => {
  const users = await userRepo.getAll();
  res.status(200).json({ payload: users.map(u => new UserDTO(u)) });
});

router.get('/me', authToken, async (req, res) => {
  const user = await userRepo.getById(req.user._id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  res.status(200).json({ payload: new UserDTO(user) });
});

router.put('/me', authToken, async (req, res) => {
  const updatedUser = await userRepo.update(req.user._id, req.body);
  res.status(200).json({ message: 'Perfil actualizado', payload: new UserDTO(updatedUser) });
});

router.delete('/me', authToken, async (req, res) => {
  const deleted = await userRepo.delete(req.user._id);
  res.status(200).json({ message: 'Cuenta eliminada', payload: new UserDTO(deleted) });
});



export default router;
