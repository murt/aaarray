/**
 * Callback used for the equivalent of Array#map.
 */
export type AAMapCallback<T, U> = (value: T, index: number, arr: T[]) => U | Promise<U>;

/**
 * This is a callback type that describes a function called when iterating over the values in the AAArray. It is possible
 * for it to return truthy/false values (eg. filter) or simply return nothing (eg. forEach); This is different to the
 * map callbacks as the return type is *not* important here.
 */
export type AAIterCallback<T> = (value: T, index: number, arr: T[]) => any;

/**
 * This is a callback type that describes a sorting comparison function.
 */
export type AASortCallback<T> = (a: T, b: T) => number | Promise<number>;

/**
 * This is a callback that describes a direct mutation of the array with corresponding type updates.
 */
export type AAMutateCallback<T, U = T> = (arr: T[]) => U[];

// TODO: Investigate if we can actually see the full type of the callback as this might be handy in autocomp
// down the line - right now it only shows AAMapCallback for example instead of all the params actually needed.
export type AACallback<T, U> = AAMapCallback<T, U> | AAIterCallback<T> | AASortCallback<T> | AAMutateCallback<T, U>;

/**
 * This is an optional inline callback that, when supplied, will receive portions of the array that mutational methods
 * provide - for example pop or shift will provide the value they remove from the original array to this function. No
 * value needs to be returned as it is not used. If the callback is async AAArray will wait before it finishes to
 * proceed onto any other steps in the chain.
 */
export type AAInlineCallback<T, U = T> = (value: U | undefined, arr: T | T[]) => Promise<void> | void;

/**
 * This is a callback exclusively for reduce functionality.
 *
 * TODO: Get the types right so that the callbacks return type is properly passed to prev/accumulator
 * TODO: typeof Array.prototype.reduce but with a possible Promise return?
 */
export type AAReduceCallback<T, U = T> = (accumulator: U, currentValue: T, index: number, arr: T[]) => U | Promise<U>;

export enum AAAction {
    EACH,
    FILTER,
    MAP,
    MUTATE,
    SORT,
}

export type AAActionDelegate<C = AACallback<any, any>> = { action: AAAction; callback: C; serial?: boolean };


