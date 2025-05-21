const jsonHeaders: HeadersInit = { 'Content-Type': 'application/json' };
const textHeaders: HeadersInit = { 'Content-Type': 'text/plain' };

export class ApiError extends Error {
  status: number;
  response: unknown;

  constructor(message: string, status: number, response: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

export type CreateRequestOptions = {
  credentials?: RequestCredentials;
};

export type RequestOptions<Result> = {
  method: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  fileBody?: File;
  textBody?: string;
  jsonBody?: unknown;
  onSuccess?: (result: Result) => void;
  onError?: (error: unknown) => void;
};

export const createRequest = (
  apiBaseUrl?: string,
  createOptions?: CreateRequestOptions,
) => {
  const { credentials } = createOptions ?? {};

  return async <Result = void>(
    options: RequestOptions<Result>,
  ): Promise<Result> => {
    const {
      method,
      endpoint,
      fileBody,
      textBody,
      jsonBody,
      onSuccess,
      onError,
    } = options;

    try {
      const getHeaders = () => {
        if (fileBody) return undefined;
        if (textBody) return textHeaders;
        if (jsonBody) return jsonHeaders;
        return undefined;
      };
      const getBody = () => {
        if (fileBody) {
          const formData = new FormData();
          formData.append('file', fileBody);
          return formData;
        }
        if (textBody) return textBody;
        if (jsonBody) return JSON.stringify(jsonBody);
        return undefined;
      };
      const body = getBody();

      const url = apiBaseUrl ? new URL(endpoint, apiBaseUrl) : endpoint;
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body,
        credentials,
      });

      if (!response.ok) {
        try {
          const details = await response.json();
          throw new ApiError(response.statusText, response.status, details);
        } catch {
          throw new ApiError(response.statusText, response.status, undefined);
        }
      }
      const result = await response.json();
      onSuccess?.(result);
      return result;
    } catch (error) {
      onError?.(error);
      throw error;
    }
  };
};
