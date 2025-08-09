/* eslint-disable @typescript-eslint/consistent-type-assertions */
import z from 'zod';
import { ApiRoute, RequestMethod } from './apiRoute';
import { coerceSchema } from './coerceSchema';
import { error } from './error';

export const fastifyRoute = <
  Method extends RequestMethod,
  Path extends string,
  ParamsSchema,
  RequestSchema,
  ResponseSchema,
>(
  route: ApiRoute<Method, Path, ParamsSchema, RequestSchema, ResponseSchema>,
) => {
  const {
    method,
    path,
    paramsSchema,
    requestSchema,
    responseSchema,
    isMultipart,
  } = route;
  const getParams = (): ParamsSchema => {
    if (paramsSchema instanceof z.ZodVoid) {
      return z.object({}) as ParamsSchema;
    }
    return paramsSchema;
  };
  const getBody = (): RequestSchema => {
    if (method === 'get') {
      return undefined as RequestSchema;
    }
    if (requestSchema instanceof z.ZodVoid) {
      return undefined as RequestSchema;
    }
    return requestSchema;
  };
  const getResponse = (): ResponseSchema => {
    if (responseSchema instanceof z.ZodVoid) {
      return z.null() as ResponseSchema;
    }
    return responseSchema;
  };
  const result = {
    method,
    url: path,
    schema: {
      params: coerceSchema(getParams()),
      consumes: isMultipart ? ['multipart/form-data'] : undefined,
      body: isMultipart ? coerceSchema(getBody()) : getBody(),
      response: {
        200: getResponse(),
        400: error.responseSchema,
        404: error.responseSchema,
      },
    },
  };
  if (result.schema.body === undefined) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete result.schema.body;
  }
  return result;
};
