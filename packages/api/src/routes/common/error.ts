import axios, { AxiosError } from 'axios';
import { z } from 'zod';

export namespace error {
  export const responseSchema = z.object({
    message: z.string(),
  });
  export type Response = z.infer<typeof responseSchema>;

  const hasMessage = (value: unknown): value is Response =>
    responseSchema.safeParse(value).success;

  const isResponse = (
    value: unknown,
  ): value is AxiosError<Response> =>
    axios.isAxiosError(value) && hasMessage(value.response?.data);

  export const getMessage = (value: unknown) => {
    return isResponse(value)
      ? value.response?.data.message
      : undefined;
  };
}
