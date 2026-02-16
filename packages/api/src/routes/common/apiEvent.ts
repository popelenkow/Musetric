import type z from 'zod';

export type UnsubscribeApiEvent = () => void;
export type ApiEvent<Path, EventSchema> = {
  path: Path;
  schema: EventSchema;
  stringify: (event: z.infer<EventSchema>) => string;
  subscribe: (
    callback: (event: z.infer<EventSchema>) => void,
  ) => UnsubscribeApiEvent;
};

export type CreateApiEventOptions<Path, EventSchema> = {
  path: Path;
  schema: EventSchema;
};

export const createApiEvent = <
  Path extends string,
  EventSchema extends z.ZodTypeAny,
>(
  options: CreateApiEventOptions<Path, EventSchema>,
) => {
  const { path, schema } = options;

  return {
    path,
    schema,
    stringify: (event: z.infer<EventSchema>): string => {
      const validatedEvent = schema.parse(event);
      return JSON.stringify(validatedEvent);
    },
    subscribe: (callback: (event: z.infer<EventSchema>) => void) => {
      const source = new EventSource(path);
      source.onmessage = (event) => {
        const parsedEvent = JSON.parse(event.data);
        const validatedEvent = schema.parse(parsedEvent);
        callback(validatedEvent);
      };
      source.onerror = (error) => {
        console.error('API Event SSE error', error);
      };
      return () => {
        source.close();
      };
    },
  };
};
