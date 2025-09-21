export const hasValue = <T>(value: T): value is NonNullable<T> =>
  // eslint-disable-next-line no-restricted-syntax
  value !== null && value !== undefined;
