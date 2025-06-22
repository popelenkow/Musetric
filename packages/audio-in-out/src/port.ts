/* eslint-disable @typescript-eslint/consistent-type-assertions */
type BaseEvent = {
  type: string;
};

export type EventHandlers<Event extends BaseEvent> = {
  [Key in Event['type']]: (msg: Extract<Event, { type: Key }>) => void;
};

export const createPort = <
  HandleEvent extends BaseEvent,
  SendEvent extends BaseEvent,
>(
  port: MessagePort,
  handlers: EventHandlers<HandleEvent>,
) => {
  port.onmessage = (event: MessageEvent<HandleEvent>) => {
    type Type = HandleEvent['type'];
    const handle = handlers[event.data.type as Type];
    handle(event.data as Extract<HandleEvent, { type: Type }>);
  };
  return {
    send: (event: SendEvent, options?: StructuredSerializeOptions) => {
      port.postMessage(event, options);
    },
  };
};
