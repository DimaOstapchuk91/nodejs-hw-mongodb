const parsePageValue = (value, defaultValue) => {
  if (typeof value === 'string') defaultValue;

  const parsedValue = parseInt(value, 10);

  if (Number.isNaN(parsedValue)) defaultValue;

  return parsedValue;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parsePageValue(page, 1);
  const parsedPerPage = parsePageValue(perPage, 1);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
