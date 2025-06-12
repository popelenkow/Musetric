import z from 'zod/v4';
import { ApiRoute, RequestMethod } from './apiRoute';
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
  const getParams = () => {
    if (paramsSchema instanceof z.ZodVoid) {
      return z.object({});
    }
    return paramsSchema;
  };
  const getBody = () => {
    if (method === 'get') {
      return undefined;
    }
    if (requestSchema instanceof z.ZodVoid) {
      return undefined;
    }
    return requestSchema;
  };
  const getResponse = () => {
    if (responseSchema instanceof z.ZodVoid) {
      return z.null();
    }
    return responseSchema;
  };
  const result = {
    method,
    url: path,
    schema: {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      params: getParams() as ParamsSchema,
      consumes: isMultipart ? ['multipart/form-data'] : undefined,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      body: getBody() as RequestSchema,
      response: {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        200: getResponse() as ResponseSchema,
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
