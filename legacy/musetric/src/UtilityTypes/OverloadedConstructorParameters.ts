/* https://github.com/microsoft/TypeScript/issues/32164 */

type FN = new (...args: unknown[]) => unknown;

type Params<T> = T extends {
    new (...args: infer A1): unknown,
    new (...args: infer A2): unknown,
    new (...args: infer A3): unknown,
    new (...args: infer A4): unknown,
    new (...args: infer A5): unknown,
    new (...args: infer A6): unknown,
    new (...args: infer A7): unknown,
    new (...args: infer A8): unknown,
    new (...args: infer A9): unknown,
}
    ? [A1, A2, A3, A4, A5, A6, A7, A8, A9]
    : never;

type FilterUnknowns<T> = T extends [infer A, ...infer Rest]
    ? unknown[] extends A
        ? FilterUnknowns<Rest>
        : [A, ...FilterUnknowns<Rest>]
    : T;

type TupleArrayUnion<A extends readonly unknown[][]> = A extends (infer T)[]
    ? T extends unknown[]
        ? T
        : []
    : [];

export type OverloadedConstructorParameters<T extends FN>
    = TupleArrayUnion<FilterUnknowns<Params<T>>>;
