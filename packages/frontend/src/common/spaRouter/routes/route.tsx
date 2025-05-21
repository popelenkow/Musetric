/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createLink, LinkFC } from '../Link';
import { onChangeLocation, useMemoLocation } from '../locationEvent';
import { createMatch, MatchFC } from '../Match';

export type RouteOptions<Params extends object, NativeParams> = {
  locationNativeParams?: () => NativeParams;
  parseNativeParams?: (nativeParams: NativeParams) => Params;
  toNativeParams?: (params: Params) => NativeParams;
  urlByNativeParams?: (params: NativeParams) => string;
  prefixName?: string;
};

export type Route<Params extends object, NativeParams> = {
  locationNativeParams: () => NativeParams;
  parseNativeParams: (nativeParams: NativeParams) => Params;
  toNativeParams: (params: Params) => NativeParams;
  urlByNativeParams: (params: NativeParams) => string;
  href: (params: Params) => string;
  navigate: keyof Params extends never
    ? (params?: Params) => void
    : (params: Params) => void;
  Link: LinkFC<Params>;
  assertMatch: () => Params;
  match: () => Params | undefined;
  useAssertMatch: () => Params;
  useMatch: () => Params | undefined;
  Match: MatchFC<Params>;
};

export const createRoute = <Params extends object, NativeParams>(
  options: RouteOptions<Params, NativeParams>,
): Route<Params, NativeParams> => {
  const {
    locationNativeParams = () => ({}) as NativeParams,
    parseNativeParams = (nativeParams) => nativeParams as unknown as Params,
    toNativeParams = (params) => params as unknown as NativeParams,
    urlByNativeParams = () => '',
    prefixName,
  } = options;

  const href = (params: Params) => {
    const nativeParams = toNativeParams(params);
    return urlByNativeParams(nativeParams);
  };
  const navigate = (params: Params = {} as Params) => {
    const nativeParams = toNativeParams(params);
    const url = urlByNativeParams(nativeParams);
    history.pushState({}, '', url);
    onChangeLocation();
  };
  const Link = createLink(href, navigate, prefixName);
  const assertMatch = (): Params => {
    const nativeParams = locationNativeParams();
    return parseNativeParams(nativeParams);
  };
  const match = () => {
    try {
      return assertMatch();
    } catch {
      return undefined;
    }
  };
  const useAssertMatch = () => useMemoLocation(assertMatch);
  const useMatch = () => useMemoLocation(match);
  const Match = createMatch(match, prefixName);

  return {
    locationNativeParams,
    parseNativeParams,
    toNativeParams,
    urlByNativeParams,
    href,
    navigate,
    Link,
    assertMatch,
    match,
    useAssertMatch,
    useMatch,
    Match,
  };
};
