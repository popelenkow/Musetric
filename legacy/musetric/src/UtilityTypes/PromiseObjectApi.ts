type PromiseIfFunction<Fn> =
    Fn extends (...args: infer A) => infer R
        ? (...args: A) => Promise<R>
        : Fn;

export type PromiseObjectApi<Obj> = {
    [K in keyof Obj]: PromiseIfFunction<Obj[K]>;
};
