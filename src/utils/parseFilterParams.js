const parseContactType = (contactType) => {
  if (typeof contactType !== 'string') return;

  const isType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isType(contactType)) return contactType;
};

const parseIsFavorite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;

  let transformValue = undefined;

  if (isFavourite === 'true') {
    transformValue = true;
  } else if (isFavourite === 'false') {
    transformValue = false;
  }

  if (typeof transformValue !== 'boolean') return;

  return transformValue;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseIsFavorite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
