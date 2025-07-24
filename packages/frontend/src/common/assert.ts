export const assertDefined = <T>(value: T, message: string): NonNullable<T> => {
  // eslint-disable-next-line no-restricted-syntax
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  return value;
};

export const assertNever = (
  value: never,
  message: string = 'Unexpected value',
): never => {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
};
