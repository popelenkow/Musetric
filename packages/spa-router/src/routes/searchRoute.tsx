/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NativeParams, getLocationSearchParams } from '../common/common';
import { Route, createRoute } from './route';

export type SearchRouteOptions<Params extends object> = {
  parseNativeParams?: (nativeParams: NativeParams) => Params;
  toeNativeParams?: (params: Params) => NativeParams;
};

export type SearchRoute<Params extends object> = Route<Params, NativeParams>;

export const createSearchRoute = <Params extends object = {}>(
  options?: SearchRouteOptions<Params>,
): SearchRoute<Params> => {
  const route = createRoute({
    locationNativeParams: getLocationSearchParams,
    urlByNativeParams: (params) => new URLSearchParams(params).toString(),
    toNativeParams: () => ({}),
    ...options,
  });
  return route;
};
