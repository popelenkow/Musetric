/* eslint-disable no-restricted-syntax */
export class SpawnScriptError extends Error {
  public readonly code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'SpawnScriptError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
