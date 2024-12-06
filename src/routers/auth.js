import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registrationUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registrationSchema } from '../validation/auth.js';

const jsonParser = express.json();

const router = Router();

router.post(
  '/register',
  jsonParser,
  validateBody(registrationSchema),
  ctrlWrapper(registrationUserController),
);

export default router;
