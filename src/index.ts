// TODO: Index accessors? Supporting for-in or for-of? Synchronous functions
export interface AAArray<T> {
    readonly length: number,
    map(callback: AAMapDelegate<T>): Promise<AAArray<T>>;
    toArray(): T[];
    toString(): string;
    [index: number]: T;
}

export interface AAMapDelegate<T> {
    (value: T, index: number, arr: T[]): T | Promise<T>;
}

/**
 * Entrypoint for all aaarray functionality.
 * 
 * @param array Array value that will be used to initialise the AAArray
 * @returns New AAArray object
 */
export default function AA<U>(array: Array<U>): AAArray<U> {
    return {
        length: array.length,
        map: async (callback: AAMapDelegate<U>) => {
            return await Promise.all(array.map(callback)).then(AA);
        },
        toArray: () => array,
        toString: () => array.toString(),
    };
}
