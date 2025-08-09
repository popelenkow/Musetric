/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AxiosInstance } from 'axios';
import z from 'zod';
import { ApiRoute, RequestMethod } from './apiRoute';
import { isUint8ArraySchema } from './uint8ArraySchema';

type AxiosParams<ParamsSchema> = ParamsSchema extends z.ZodVoid
  ? {}
  : { params: z.infer<ParamsSchema> };

type AxiosRequest<RequestSchema> = RequestSchema extends z.ZodVoid
  ? {}
  : { data: z.infer<RequestSchema> };

export type AxiosRequestOptions<ParamsSchema, RequestSchema> =
  AxiosParams<ParamsSchema> & AxiosRequest<RequestSchema>;

export const axiosRequest = <
  Method extends RequestMethod,
  Path extends string,
  ParamsSchema,
  RequestSchema,
  ResponseSchema,
>(
  route: ApiRoute<Method, Path, ParamsSchema, RequestSchema, ResponseSchema>,
) => {
  return async (
    axios: AxiosInstance,
    options: AxiosRequestOptions<ParamsSchema, RequestSchema>,
  ) => {
    const params = (options as { params: z.infer<ParamsSchema> }).params;
    const data = (options as { data: z.infer<RequestSchema> }).data;

    const isUint8Array = isUint8ArraySchema(route.responseSchema);
    const response = await axios.request<z.infer<ResponseSchema>>({
      method: route.method,
      url: route.endpoint(params),
      data: route.request(data),
      responseType: isUint8Array ? 'arraybuffer' : 'json',
    });

    if (isUint8Array) {
      const result = new Uint8Array(response.data as ArrayBuffer);
      return result as z.infer<ResponseSchema>;
    }
    return response.data;
  };
};
