import { Router } from 'express';
import {
  requestReset,
  confirmReset
} from '../controllers/reset.controller.js';

const router = Router();

router.post('/request', requestReset);

router.post('/password/:token', confirmReset);

export default router;