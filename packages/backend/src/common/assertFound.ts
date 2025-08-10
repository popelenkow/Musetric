// eslint-disable-next-line no-restricted-syntax
export class NotFoundError extends Error {
  public readonly statusCode = 404;
}

export type AssertFound = <T>(
  value: T,
  message: string,
) => asserts value is NonNullable<T>;

export const assertFound: AssertFound = (value, message) => {
  // eslint-disable-next-line no-restricted-syntax
  if (value === null || value === undefined) {
    throw new NotFoundError(message);
  }
};
