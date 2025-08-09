/* eslint-disable @typescript-eslint/consistent-type-assertions */
import z from 'zod';
import { endpoint } from './endpoint';
import { multipart } from './multipart';

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ApiRoute<
  Method,
  Path,
  ParamsSchema,
  RequestSchema,
  ResponseSchema,
> = {
  method: Method;
  path: Path;
  paramsSchema: ParamsSchema;
  endpoint: (params: z.infer<ParamsSchema>) => string;
  requestSchema: RequestSchema;
  request: (data: z.infer<RequestSchema>) => z.infer<RequestSchema> | FormData;
  responseSchema: ResponseSchema;
  isMultipart?: boolean;
};

export type CreateApiRouteOptions<
  Method,
  Path,
  ParamsSchema,
  RequestSchema,
  ResponseSchema,
> = {
  method: Method;
  path: Path;
  paramsSchema: ParamsSchema;
  requestSchema: RequestSchema;
  responseSchema: ResponseSchema;
  isMultipart?: boolean;
};

export const createApiRoute = <
  Method extends RequestMethod,
  Path extends string,
  ParamsSchema,
  RequestSchema,
  ResponseSchema,
>(
  options: CreateApiRouteOptions<
    Method,
    Path,
    ParamsSchema,
    RequestSchema,
    ResponseSchema
  >,
): ApiRoute<Method, Path, ParamsSchema, RequestSchema, ResponseSchema> => {
  const {
    method,
    path,
    paramsSchema,
    requestSchema,
    responseSchema,
    isMultipart,
  } = options;
  return {
    method,
    path,
    paramsSchema,
    endpoint: (params: z.infer<ParamsSchema>) =>
      endpoint(path, params as Record<string, string | number>),
    requestSchema,
    request: (data: z.infer<RequestSchema>) =>
      isMultipart ? multipart.data(data as object) : data,
    responseSchema,
    isMultipart,
  };
};
