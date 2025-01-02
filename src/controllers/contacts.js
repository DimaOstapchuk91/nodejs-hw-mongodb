import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const { user } = req;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    user,
  });

  if (!contacts) throw createHttpError(404, 'Contacts not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const gerContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { user } = req;

  const contact = await getContactById(contactId, user);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is missing');
  }

  const { user } = req;

  const result = await createContact({ ...req.body, userId: user._id });

  if (!result) throw createHttpError(404, 'Filed to create contact');

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { user } = req;

  const result = await updateContact(contactId, user, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { user } = req;

  const result = await deleteContact(contactId, user);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(204).end();
};
