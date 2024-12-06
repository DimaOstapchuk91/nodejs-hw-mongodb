import { Router } from 'express';
import authRouter from './auth.js';
import contactRouter from './contacts.js';

const router = Router();

router.use('/contacts', contactRouter);
router.use('/auth', authRouter);

export default router;
