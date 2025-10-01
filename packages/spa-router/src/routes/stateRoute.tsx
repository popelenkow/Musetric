/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Route, createRoute } from './route.js';

export type StateRouteOptions<Params extends object> = {
  parseNativeParams?: (nativeParams: unknown) => Params;
  toNativeParams?: (params: Params) => unknown;
};
export type StateRoute<Params extends object> = Route<Params, unknown>;

export const createStateRoute = <Params extends object = {}>(
  options?: StateRouteOptions<Params>,
): StateRoute<Params> => {
  const route = createRoute({
    locationNativeParams: () => window.history.state,
    ...options,
  });
  return route;
};
