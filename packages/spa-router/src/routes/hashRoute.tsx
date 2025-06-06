/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  NativeParams,
  extractPathParams,
  getLocationHash,
  makePath,
} from '../common/common';
import { Route, createRoute } from './route';

export type HashRouteOptions<
  Pattern extends string | undefined,
  Params extends object,
> = {
  pattern?: Pattern;
  parseNativeParams?: (params: NativeParams) => Params;
  toNativeParams?: (params: Params) => NativeParams;
};

export type HashRoute<
  Pattern extends string | undefined,
  Params extends object,
> = Route<Params, NativeParams> & {
  pattern: Pattern;
};

export const createHashRoute = <
  Pattern extends string | undefined = undefined,
  Params extends object = {},
>(
  options?: HashRouteOptions<Pattern, Params>,
): HashRoute<Pattern, Params> => {
  const pattern = options?.pattern;

  const createHashOptions = () => {
    if (!pattern) {
      return {};
    }

    const locationNativeParams = () => {
      const hash = getLocationHash();
      const nativeParams = extractPathParams(hash, pattern);
      if (!nativeParams) {
        throw new Error(`Hash "${hash}" does not match pattern "${pattern}"`);
      }
      return nativeParams;
    };

    const urlByNativeParams = (params: NativeParams) => {
      const hash = makePath(pattern, params);
      return hash ? `#${hash}` : '';
    };

    return {
      locationNativeParams,
      urlByNativeParams,
    };
  };

  const route = createRoute({
    ...createHashOptions(),
    ...options,
  });

  return {
    ...route,
    pattern: pattern as Pattern,
  };
};
