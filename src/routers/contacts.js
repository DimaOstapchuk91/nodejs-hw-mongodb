import { Router } from 'express';
import express from 'express';
import {
  createContactController,
  deleteContactController,
  gerContactByIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constans/constans.js';
import { upload } from '../middlewares/upload.js';

const jsonParser = express.json();

const router = Router();

router.get(
  '/',
  authenticate,
  checkRoles(ROLES.ADMIN, ROLES.USER),
  ctrlWrapper(getContactsController),
);

router.get(
  '/:contactId',
  authenticate,
  checkRoles(ROLES.ADMIN, ROLES.USER),
  isValidId,
  ctrlWrapper(gerContactByIdController),
);

router.post(
  '/',
  authenticate,
  checkRoles(ROLES.ADMIN, ROLES.USER),
  jsonParser,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  authenticate,
  checkRoles(ROLES.ADMIN, ROLES.USER),
  isValidId,
  jsonParser,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);

router.delete(
  '/:contactId',
  authenticate,
  checkRoles(ROLES.ADMIN, ROLES.USER),
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
