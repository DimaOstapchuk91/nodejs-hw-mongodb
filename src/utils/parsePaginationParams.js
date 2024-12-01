const parsePageValue = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue;

  const parsedValue = parseInt(value, 10);

  console.log(typeof parsedValue);
  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parsePageValue(page, 1);
  const parsedPerPage = parsePageValue(perPage, 5);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
