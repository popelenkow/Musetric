export const endpoint = (
  route: string,
  params: Record<string, string | number> = {},
) =>
  Object.entries(params).reduce((acc, entry) => {
    const [key, value] = entry;
    return acc.replace(`:${key}`, String(value));
  }, route);
