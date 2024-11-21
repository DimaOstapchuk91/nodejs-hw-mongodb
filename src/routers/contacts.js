import { Router } from 'express';
import express from 'express';
import {
  createContactController,
  gerContactByIdController,
  getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const jsonParser = express.json();

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(gerContactByIdController));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

export default router;
