/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AxiosInstance } from 'axios';
import z from 'zod';
import { ApiRoute, RequestMethod } from './apiRoute.js';
import { getArrayBufferViewConstructor } from './arrayBufferView.js';

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
  const arrayConstructor = getArrayBufferViewConstructor(route.responseSchema);

  return async (
    axios: AxiosInstance,
    options: AxiosRequestOptions<ParamsSchema, RequestSchema>,
  ) => {
    const params = (options as { params: z.infer<ParamsSchema> }).params;
    const data = (options as { data: z.infer<RequestSchema> }).data;

    const response = await axios.request<z.infer<ResponseSchema>>({
      method: route.method,
      url: route.endpoint(params),
      data: route.request(data),
      responseType: arrayConstructor ? 'arraybuffer' : 'json',
    });

    if (arrayConstructor) {
      const arrayBuffer = response.data as ArrayBuffer;
      const result = new arrayConstructor(arrayBuffer);
      return result;
    }
    return response.data;
  };
};
