import { Router } from 'express';
import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registrationUserController,
  requestResetEmailController,
  resetUserPaswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginSchema,
  registrationSchema,
  requstResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const jsonParser = express.json();

const router = Router();

router.post(
  '/register',
  jsonParser,
  validateBody(registrationSchema),
  ctrlWrapper(registrationUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-emai',
  jsonParser,
  validateBody(requstResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetUserPaswordController),
);

export default router;
