import { describe, it, expect } from 'vitest';
import { createCallLatest } from '../../callLatest';
import { createPromiseController, getExpectedResults } from './common';
import { callLatestFixtures } from './fixture';

describe('callLatest', () => {
  callLatestFixtures.forEach((fixture) => {
    it(fixture.name, async () => {
      const { asyncFunction, resolve } = createPromiseController(
        fixture.resolveIndices,
      );
      const callLatest = createCallLatest(asyncFunction);
      const promises: Promise<number>[] = [];

      for (let callIndex = 0; callIndex < fixture.callCount; callIndex++) {
        const promise = callLatest(callIndex);
        promises.push(promise);
        await resolve(callIndex);
      }

      const results = await Promise.all(promises);
      const expectedResults = getExpectedResults(
        fixture.callCount,
        fixture.resolveIndices,
      );
      expect(results).toEqual(expectedResults);
    });
  });
});
