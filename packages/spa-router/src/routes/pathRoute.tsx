/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { NativeParams, extractPathParams, makePath } from '../common/common';
import { Route, createRoute } from './route';

export type PathRouteOptions<
  Pattern extends string | undefined,
  Params extends object,
> = {
  pattern?: Pattern;
  parseNativeParams?: (nativeParams: NativeParams) => Params;
  toNativeParams?: (params: Params) => NativeParams;
};

export type PathRoute<
  Pattern extends string | undefined,
  Params extends object,
> = Route<Params, NativeParams> & {
  pattern: Pattern;
};

export const createPathRoute = <
  Pattern extends string | undefined = undefined,
  Params extends object = {},
>(
  options?: PathRouteOptions<Pattern, Params>,
): PathRoute<Pattern, Params> => {
  const pattern = options?.pattern;

  const createPathOptions = () => {
    if (!pattern) {
      return {};
    }

    const locationNativeParams = () => {
      const path = window.location.pathname;
      const nativeParams = extractPathParams(path, pattern);
      if (!nativeParams) {
        throw new Error(`Path "${path}" does not match pattern "${pattern}"`);
      }
      return nativeParams;
    };

    const urlByNativeParams = (params: NativeParams) =>
      makePath(pattern, params);

    return {
      locationNativeParams,
      urlByNativeParams,
    };
  };

  const route = createRoute({
    ...createPathOptions(),
    ...options,
  });

  return {
    ...route,
    pattern: pattern as Pattern,
  };
};
