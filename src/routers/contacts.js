import { Router } from 'express';
import {
  gerContactByIdController,
  getContactsController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', gerContactByIdController);

export default router;
