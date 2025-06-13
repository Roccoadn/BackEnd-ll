import { Router } from 'express';
import { CartRepository } from '../repositories/cart.repository.js';

const router = Router();
const cartRepo = new CartRepository();

router.post('/', async (req, res) => {
  const cart = await cartRepo.create({ products: [] });
  res.status(201).json({ payload: cart });
});

router.put('/:cid/product/:pid', async (req, res) => {
  const { action } = req.body;
  const cart = await cartRepo.updateQuantity(req.params.cid, req.params.pid, action);
  if (!cart) return res.status(404).json({ message: 'Cart or product not found' });
  res.status(200).json({ payload: cart });
});

router.get('/', async (_req, res) => {
  const carts = await cartRepo.getAll();
  res.status(200).json({ payload: carts });
});

router.get('/:cid', async (req, res) => {
  const cart = await cartRepo.getById(req.params.cid);
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  res.status(200).json({ payload: cart });
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartRepo.addProduct(req.params.cid, req.params.pid, Number(req.body.quantity) || 1);
  if (!cart) return res.status(404).json({ message: 'Cart or product not found' });
  res.status(200).json({ payload: cart });
});

router.delete('/:cid/product/:pid', async (req, res) => {
  const cart = await cartRepo.removeProduct(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ message: 'Cart or product not found' });
  res.status(200).json({ payload: cart });
});

router.delete('/:cid', async (req, res) => {
  const cart = await cartRepo.clearCart(req.params.cid);
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  res.status(200).json({ payload: cart });
});

export default router;
