/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

export type Entry<T, Key extends keyof T = keyof T> = [Key, T[Key]];
/** Object.entries */
export const getObjectEntries = <T extends Record<string, any>, Key extends keyof T = keyof T>(
    object: T,
    filter: (entry: Entry<T>) => entry is Entry<T, Key> = (_): _ is Entry<T, Key> => true,
): Entry<T, Key>[] => {
    const entries = Object.entries(object);
    const result = entries.filter(filter) as Entry<T, Key>[];
    return result;
};

/** Object.keys */
export const getObjectKeys = <T extends Record<string, any>, Key extends keyof T = keyof T>(
    object: T,
    filter?: (entry: Entry<T>) => entry is Entry<T, Key>,
): Key[] => {
    const entries = getObjectEntries(object, filter);
    const result = entries.map(([key]) => key);
    return result;
};

export type FilteredObject<T, Key extends keyof T> = {
    [K in Key]: T[K]
};
export const filterObject = <T extends Record<string, any>, Key extends keyof T = keyof T>(
    object: T,
    filter?: (entry: Entry<T>) => entry is Entry<T, Key>,
): FilteredObject<T, Key> => {
    const entries = getObjectEntries(object, filter);
    const result = entries.reduce<FilteredObject<T, Key>>((acc, [key, value]) => ({
        ...acc,
        [key]: value,
    }), {} as FilteredObject<T, Key>);
    return result;
};

export const mapObject = <T extends Record<string, any>, Res extends Record<keyof T, any> = T>(
    object: T,
    map: <Key extends keyof T>(entry: Entry<T, Key>) => Res[Key],
): Res => {
    const entries = getObjectEntries(object);
    const result = entries.reduce<Res>((acc, [key, value]) => ({
        ...acc,
        [key]: map([key, value] as any),
    }), {} as Res);
    return result;
};

export const someObject = <Key extends string, Value, Result extends Value>(
    obj: Record<Key, Value>,
    predicate: (value: Value) => value is Result,
): obj is Record<Key, Result> => {
    const keys = Object.keys(obj) as Key[];
    return keys.some((key) => predicate(obj[key]));
};
