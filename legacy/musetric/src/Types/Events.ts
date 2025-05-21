export type EventHandlers<Events> = {
    [K in keyof Events]: (event: Events[K]) => void;
};

export type PushEvent<Events> = <Type extends keyof Events & string>(
    type: Type,
    event: Events[Type],
) => void;
