/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NativeParams } from '../common/common.js';
import { createHashRoute, HashRoute, HashRouteOptions } from './hashRoute.js';
import { createPathRoute, PathRoute, PathRouteOptions } from './pathRoute.js';
import { Route, createRoute } from './route.js';
import {
  createSearchRoute,
  SearchRoute,
  SearchRouteOptions,
} from './searchRoute.js';
import {
  createStateRoute,
  StateRoute,
  StateRouteOptions,
} from './stateRoute.js';

export type SpaNativeParams = {
  path: NativeParams;
  hash: NativeParams;
  search: NativeParams;
  state: unknown;
};
export type SpaRouteOptions<
  PathPattern extends string | undefined,
  PathParams extends object,
  HashPattern extends string | undefined,
  HashParams extends object,
  SearchParams extends object,
  StateParams extends object,
> = {
  path?: PathRouteOptions<PathPattern, PathParams>;
  hash?: HashRouteOptions<HashPattern, HashParams>;
  search?: SearchRouteOptions<SearchParams>;
  state?: StateRouteOptions<StateParams>;
};

export type SpaRoute<
  PathPattern extends string | undefined,
  PathParams extends object,
  HashPattern extends string | undefined,
  HashParams extends object,
  SearchParams extends object,
  StateParams extends object,
> = Route<
  PathParams & HashParams & SearchParams & StateParams,
  SpaNativeParams
> & {
  routes: {
    path: PathRoute<PathPattern, PathParams>;
    hash: HashRoute<HashPattern, HashParams>;
    search: SearchRoute<SearchParams>;
    state: StateRoute<StateParams>;
  };
};

export const createSpaRoute = <
  PathPattern extends string | undefined = undefined,
  PathParams extends object = {},
  HashPattern extends string | undefined = undefined,
  HashParams extends object = {},
  SearchParams extends object = {},
  StateParams extends object = {},
>(
  options?: SpaRouteOptions<
    PathPattern,
    PathParams,
    HashPattern,
    HashParams,
    SearchParams,
    StateParams
  >,
): SpaRoute<
  PathPattern,
  PathParams,
  HashPattern,
  HashParams,
  SearchParams,
  StateParams
> => {
  const routes = {
    path: createPathRoute(options?.path),
    hash: createHashRoute(options?.hash),
    search: createSearchRoute(options?.search),
    state: createStateRoute(options?.state),
  };
  type SpaParams = PathParams & HashParams & SearchParams & StateParams;
  const route = createRoute<SpaParams, SpaNativeParams>({
    locationNativeParams: () => ({
      path: routes.path.locationNativeParams(),
      hash: routes.hash.locationNativeParams(),
      search: routes.search.locationNativeParams(),
      state: routes.state.locationNativeParams(),
    }),
    parseNativeParams: (nativeParams) => ({
      ...routes.path.parseNativeParams(nativeParams.path),
      ...routes.hash.parseNativeParams(nativeParams.hash),
      ...routes.search.parseNativeParams(nativeParams.search),
      ...routes.state.parseNativeParams(nativeParams.state),
    }),
    toNativeParams: (params) => ({
      path: routes.path.toNativeParams(params),
      hash: routes.hash.toNativeParams(params),
      search: routes.search.toNativeParams(params),
      state: routes.state.toNativeParams(params),
    }),
    urlByNativeParams: (nativeParams) => {
      const path = routes.path.urlByNativeParams(nativeParams.path);
      const hash = routes.hash.urlByNativeParams(nativeParams.hash);
      const search = routes.search.urlByNativeParams(nativeParams.search);
      return `${path}${hash}${search}`;
    },
  });
  return {
    ...route,
    routes,
  };
};
