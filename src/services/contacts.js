import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  user,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find({ userId: user._id });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalContacts, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(totalContacts, page, perPage);
  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, user) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: user._id,
  });

  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

export const updateContact = async (contactId, user, contact, options = {}) => {
  const rawResult = await ContactsCollection.findOnedAndUpdate(
    { _id: contactId, userId: user._id },
    contact,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject.upserted),
  };
};

export const deleteContact = (contactId, user) => {
  return ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: user._id,
  });
};
