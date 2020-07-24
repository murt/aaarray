import {
    AAMapCallback,
    AASortCallback,
    AAIterCallback,
    AAMutateCallback,
    AACallback,
    AAInlineCallback,
    AAReduceCallback,
    AAAction,
    AAActionDelegate,
} from "./types";

import { flat } from "./utils";

import { validCallback } from "./decorators";

/**
 * Asynchronous array type with chainable methods.
 */
export class AAArray<T> implements PromiseLike<T[]> {
    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[] = []) {
        if (Array.isArray(array)) {
            this.array = array;
            this.queue = [];
        } else {
            throw new TypeError("Cannot create AAArray from non-array value");
        }
    }

    /**
     * Concatenates values to the end of the array.
     *
     * @param values Additional values to add to the array.
     */
    public concat<U>(...values: (T | U | ConcatArray<T | U>)[]): AAArray<T | U> {
        return this.mutate(arr => (arr as (T | U)[]).concat(...values));
    }

    /**
     * Calls the provided callback on each item in the array in parallel. Most importantly this returns the original
     * AAArray reference as opposed to voiding out after iteration like *forEach* does.
     *
     * @param callback Function to call on each item, in parallel, of the array.
     */
    @validCallback
    public each(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.EACH, callback, serial: false });
        return this;
    }

    /**
     * Calls the provided callback on each item in the array in serial. Most importantly this returns the original
     * AAArray reference as opposed to voiding out after iteration like *forEach* does.
     *
     * @param callback Function to on each item, in serial, of the array.
     */
    @validCallback
    public eachSerial(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.EACH, callback, serial: true });
        return this;
    }

    /**
     * Determines whether or not all items in the array satisfy the provided callback. Items are tested
     * in parallel.
     *
     * @param callback Callback to determine either a truthy or falsy value for each item in the array.
     */
    @validCallback
    public async every(callback: AAIterCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.resolve()).map((v, i, a) => callback(v, i, a)))).every(Boolean);
    }

    /**
     * Determines whether or not all items in the array satisfy the provided callback. Items are tested
     * in serial.
     *
     * @param callback Callback to determine either a truthy or falsy value for each item in the array.
     */
    @validCallback
    public async everySerial(callback: AAIterCallback<T>): Promise<boolean> {
        const value = await this.resolve();
        for (let i = 0; i < value.length; ++i) {
            if (!(await callback(value[i], i, value))) {
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the the array after filling the section identified by start and end with value
     *
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    public fill<U>(value: U, start = 0, end?: number): AAArray<T | U> {
        return this.mutate(arr => (arr as (T | U)[]).fill(value, start, end));
    }

    /**
     * Returns the elements of an array that meet the condition specified in a callback function that is applied
     * to each item of the array in parallel.
     *
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function
     * one time for each element in the array in parallel.
     */
    @validCallback
    public filter(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: false });
        return this;
    }

    /**
     * Returns the elements of an array that meet the condition specified in a callback function that is applied
     * to each item of the array in serial.
     *
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function
     * one time for each element in the array in serial.
     */
    @validCallback
    public filterSerial(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: true });
        return this;
    }

    @validCallback
    public async find(callback: AAIterCallback<T>): Promise<T | undefined> {
        const value = await this.resolve();
        const results = await Promise.all(
            value.map((v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
        );
        return value[results.indexOf(true)];
    }

    @validCallback
    public async findIndex(callback: AAIterCallback<T>): Promise<number> {
        return (
            await Promise.all(
                (await this.resolve()).map((v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
            )
        ).indexOf(true);
    }

    @validCallback
    public async findIndexSerial(callback: AAIterCallback<T>): Promise<number> {
        const value = await this.resolve();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return i;
            }
        }
        return -1;
    }

    @validCallback
    public async findSerial(callback: AAIterCallback<T>): Promise<T | undefined> {
        const value = await this.resolve();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return result;
            }
        }
    }

    /**
     * Returns a new array with all sub-array elements concatenated into it recursively up to the
     * specified depth.
     *
     * @param depth The maximum recursion depth
     */
    public flat<D extends number = 1>(depth?: D): AAArray<FlatArray<T[], D>> {
        // @ts-expect-error
        return this.mutate(arr => flat.call(arr, depth ?? 1));
    }

    @validCallback
    public flatMap<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        // @ts-expect-error
        return this.flat().map(callback);
    }

    @validCallback
    public async forEach(callback: AAIterCallback<T>): Promise<void> {
        await Promise.all((await this.resolve()).map(callback));
    }

    @validCallback
    public async forEachSerial(callback: AAIterCallback<T>): Promise<void> {
        const value = await this.resolve();
        for (let i = 0; i < value.length; ++i) {
            await callback(value[i], i, value);
        }
    }

    public async get(index: number): Promise<T> {
        const arr = await this.resolve();
        return arr[index < 0 ? index + arr.length : index];
    }

    public async includes(valueToFind: T, fromIndex = 0): Promise<boolean> {
        return (await this.resolve()).includes(valueToFind, fromIndex);
    }

    public async indexOf(searchElement: T, fromIndex = 0): Promise<number> {
        return (await this.resolve()).indexOf(searchElement, fromIndex);
    }

    public async join(separator?: string): Promise<string> {
        return (await this.resolve()).join(separator);
    }

    public async last(): Promise<T> {
        return this.get(-1);
    }

    public async lastIndexOf(searchElement: T, fromIndex = 0): Promise<number> {
        return (await this.resolve()).lastIndexOf(searchElement, fromIndex);
    }

    public async length(): Promise<number> {
        return (await this.resolve()).length;
    }

    @validCallback
    public map<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, serial: false });
        return (this as unknown) as AAArray<U>;
    }

    @validCallback
    public mapSerial<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, serial: true });
        return (this as unknown) as AAArray<U>;
    }

    /**
     * TODO: I am not convinced this shouldn't be async and handle *all* mutation cases
     *
     * Arbitrarily mutate the array and return back to AAArray. This allows for any type of transformation to take
     * place. The provided array is a copy of the current value it can be mutated as needed and then returned or an
     * entirely new array can also be provided.
     *
     * Direct mutations, such as setting a value at an index, do not affect the original array unless the modified
     * array is returned.
     *
     * @param callback Function that returns the new and/or transformed array.
     */
    public mutate<U>(callback: AAMutateCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MUTATE, callback });
        return (this as unknown) as AAArray<U>;
    }

    public async pop(): Promise<T | undefined> {
        return (await this.resolve()).pop();
    }

    public push<U>(value: U): AAArray<T | U> {
        return this.mutate(arr => {
            (arr as (T | U)[]).push(value);
            return arr;
        });
    }

    // TODO: Reducers that return new reduced arrays to continue with, must explicitly be arrays?

    @validCallback
    public async reduce<U = T>(callback: AAReduceCallback<T, U>, initialValue?: U): Promise<U> {
        const iv = typeof initialValue !== "undefined";
        const value = await this.resolve();
        if (!iv && !value.length) {
            throw new TypeError("Reduce of empty array with no initial value");
        } else {
            let acc = iv ? (initialValue as U) : value[0];
            for (let i = iv ? 0 : 1; i < value.length; ++i) {
                acc = await callback(acc as U, value[i], i, value);
            }
            return acc as U;
        }
    }

    @validCallback
    public async reduceRight<U>(callback: AAReduceCallback<T, U>, initialValue?: U): Promise<U | T> {
        const iv = typeof initialValue !== "undefined";
        const value = await this.resolve();
        if (!iv && !value.length) {
            throw new TypeError("Reduce of empty array with no initial value");
        } else {
            let acc = iv ? (initialValue as U) : value[value.length - 1];
            for (let i = iv ? value.length - 1 : value.length - 2; i >= 0; --i) {
                // @ts-expect-error
                acc = await callback(acc, value[i], i, value);
            }
            return acc;
        }
    }

    /**
     * Reverses the elements in the array.
     */
    public reverse(): AAArray<T> {
        return this.mutate(arr => arr.reverse());
    }

    public async shift(): Promise<T | undefined> {
        return (await this.resolve()).shift();
    }

    /**
     * Returns a section of the array as the new array value.
     *
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    public slice(begin?: number, end?: number): AAArray<T> {
        return this.mutate(arr => arr.slice(begin, end));
    }

    @validCallback
    public async some(callback: AAIterCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.resolve()).map((v, i, a) => callback(v, i, a)))).some(v => Boolean(v));
    }

    @validCallback
    public async someSerial(callback: AAIterCallback<T>): Promise<boolean> {
        const value = await this.resolve();
        for (let i = 0; i < value.length; ++i) {
            if (await callback(value[i], i, value)) {
                return true;
            }
        }
        return false;
    }

    // TODO: Valid callback if exists? New decorator?
    public sort(callback?: AASortCallback<T>): AAArray<T> {
        this.queue.push({
            action: AAAction.SORT,
            callback:
                callback ||
                ((a: T, b: T) => {
                    if (String(a) < String(b)) {
                        return -1;
                    } else if (String(a) > String(b)) {
                        return 1;
                    } else {
                        return 0;
                    }
                }),
        });
        return this;
    }

    public async resolve(): Promise<T[]> {
        let arr = this.array;
        while (this.queue.length) {
            arr = await this.run(arr, this.queue.shift() as AAActionDelegate);
        }
        return arr;
    }

    public async then<TResult1 = T[], TResult2 = never>(
        onfulfilled?: (value: T[]) => TResult1 | Promise<TResult1>,
        onrejected?: (reason: any) => TResult2 | Promise<TResult2>
    ): Promise<TResult1 | TResult2> {
        try {
            const value = await this.resolve();
            return onfulfilled ? onfulfilled(value) : (value as any);
        } catch (err) {
            if (onrejected) {
                return onrejected(err);
            } else {
                throw err;
            }
        }
    }

    public unshift<U>(value: U): AAArray<U | T> {
        return this.mutate(arr => {
            (arr as (T | U)[]).unshift(value);
            return arr;
        });
    }

    public async void(): Promise<void> {
        await this.resolve();
    }

    protected async run(arr: any[], action: AAActionDelegate): Promise<any[]> {
        switch (action.action) {
            case AAAction.EACH:
                return this.runEach(arr, action as AAActionDelegate<AAIterCallback<T>>);
            case AAAction.FILTER:
                return this.runFilter(arr, action as AAActionDelegate<AAIterCallback<T>>);
            case AAAction.MAP:
                return this.runMap(arr, action as AAActionDelegate<AAMapCallback<T, any>>);
            case AAAction.MUTATE:
                return this.runMutate(arr, action as AAActionDelegate<AAMutateCallback<T>>);
            case AAAction.SORT:
                return this.runSort(arr, action as AAActionDelegate<AASortCallback<T>>);
            default:
                return arr;
        }
    }

    protected async runEach(arr: T[], action: AAActionDelegate<AAIterCallback<T>>): Promise<T[]> {
        if (action.serial) {
            for (let i = 0; i < arr.length; ++i) {
                await action.callback(arr[i], i, arr);
            }
        } else {
            await Promise.all(arr.map(action.callback));
        }
        // Return the original array unmodified
        return arr;
    }

    protected async runFilter(arr: T[], action: AAActionDelegate<AAIterCallback<T>>): Promise<any[]> {
        let result = new Array(arr.length);
        if (action.serial) {
            for (let i = 0; i < arr.length; ++i) {
                result[i] = await action.callback(arr[i], i, arr);
            }
        } else {
            result = await Promise.all(arr.map(action.callback));
        }
        return result.reduceRight((prev, cur, i) => (cur ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)]), arr);
    }

    protected async runMap(arr: T[], action: AAActionDelegate<AAMapCallback<T, any>>): Promise<any[]> {
        if (action.serial) {
            for (let i = 0; i < arr.length; ++i) {
                arr[i] = await action.callback(arr[i], i, arr);
            }
            return arr;
        } else {
            return Promise.all(arr.map(action.callback));
        }
    }

    protected runMutate<U>(arr: T[], action: AAActionDelegate<AAMutateCallback<T, U>>): U[] | T[] {
        const result = action.callback([...arr]);
        if (result instanceof Array) {
            return result;
        } else if (typeof result === "undefined") {
            return arr;
        } else {
            throw new TypeError("Invalid AAArray mutation return value, only arrays and undefined may be returned");
        }
    }

    protected async runSort(arr: T[], action: AAActionDelegate<AASortCallback<T>>): Promise<T[]> {
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < arr.length; ++i) {
                if ((await action.callback(arr[i], arr[i + 1])) > 0) {
                    const tmp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = tmp;
                    swapped = true;
                }
            }
        } while (swapped);
        return arr;
    }
}

export function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}

// Default export is the AA function
export default AA;
