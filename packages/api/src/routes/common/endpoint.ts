export const endpoint = (
  route: string,
  params: Record<string, string | number> = {},
) =>
  Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    route,
  );
