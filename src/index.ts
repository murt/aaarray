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
export type AASortCallback<T> = (a: T, b: T) => number;

/**
 * This is a callback that describes a direct mutation of the array with corresponding type updates.
 */
export type AAMutateCallback<T, U = T> = (arr: T[]) => U[];

// TODO: Investigate if we can actually see the full type of the callback as this might be handy in autocomp
// down the line - right now it only shows AAMapCallback for example instead of all the params actually needed.
type AACallback<T, U> = AAMapCallback<T, U> | AAIterCallback<T> | AASortCallback<T> | AAMutateCallback<T, U>;

/**
 * This is a callback exclusively for reduce functionality.
 *
 * TODO: Get the types right so that the callbacks return type is properly passed to prev/accumulator
 */
export type AAReduceCallback<T, U> = (accumulator: T, currentValue: T, index: number, arr: T[]) => U | Promise<U>;

enum AAAction {
    EACH,
    FILTER,
    MAP,
    MUTATE,
    SORT,
}

type AAActionDelegate<C = AACallback<any, any>> = { action: AAAction; callback: C; serial?: boolean };

/**
 * Asynchronous array type with chainable methods.
 */
export class AAArray<T> implements PromiseLike<T[]> {
    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[]) {
        this.array = array;
        this.queue = [];
    }

    /**
     * Concatenates values to the end of the array.
     *
     * @param values Additional values to add to the array.
     */
    public concat<U>(...values: (T | U | ConcatArray<T | U>)[]): AAArray<T | U> {
        return this.mutate(arr => (arr as (T | U)[]).concat(...values)) as AAArray<T | U>;
    }

    /**
     * Calls the provided callback on each item in the array in parallel. Most importantly this returns the original
     * AAArray reference as opposed to voiding out after iteration like *forEach* does.
     *
     * @param callback Function to call on each item, in parallel, of the array.
     */
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
    public async every(callback: AAIterCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.value()).map((v, i, a) => callback(v, i, a)))).every(Boolean);
    }

    /**
     * Determines whether or not all items in the array satisfy the provided callback. Items are tested
     * in serial.
     *
     * @param callback Callback to determine either a truthy or falsy value for each item in the array.
     */
    public async everySerial(callback: AAIterCallback<T>): Promise<boolean> {
        const value = await this.value();
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
        return this.mutate(arr => (arr as (T | U)[]).fill(value, start, end)) as AAArray<T | U>;
    }

    public filter(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: false });
        return this;
    }

    public filterSerial(callback: AAIterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: true });
        return this;
    }

    public async find(callback: AAIterCallback<T>): Promise<T | undefined> {
        const value = await this.value();
        // TODO: Would this be better as Promise.race?
        const results = await Promise.all(
            value.map(async (v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
        );
        return value[results.indexOf(true)];
    }

    public async findIndex(callback: AAIterCallback<T>): Promise<number> {
        return (await Promise.all(
            (await this.value()).map(async (v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
        )).indexOf(true);
    }

    public async findIndexSerial(callback: AAIterCallback<T>): Promise<number> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return i;
            }
        }
        return -1;
    }

    public async findSerial(callback: AAIterCallback<T>): Promise<T | undefined> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return result;
            }
        }
    }

    public flat(depth = 1): AAArray<T> {
        return this.mutate(arr => arr.flat(depth));
    }

    public flatMap<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        return this.flat().map(callback);
    }

    public async forEach(callback: AAIterCallback<T>): Promise<void> {
        await Promise.all((await this.value()).map(callback));
    }

    public async forEachSerial(callback: AAIterCallback<T>): Promise<void> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            await callback(value[i], i, value);
        }
    }

    public async get(index: number): Promise<T> {
        return (await this.value())[index];
    }

    public async includes(valueToFind: T, fromIndex = 0): Promise<boolean> {
        return (await this.value()).includes(valueToFind, fromIndex);
    }

    public async indexOf(searchElement: T, fromIndex = 0): Promise<number> {
        return (await this.value()).indexOf(searchElement, fromIndex);
    }

    public async join(separator?: string): Promise<string> {
        return (await this.value()).join(separator);
    }

    public async lastIndexOf(searchElement: T, fromIndex = 0): Promise<number> {
        return (await this.value()).lastIndexOf(searchElement, fromIndex);
    }

    public map<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, serial: false });
        return (this as unknown) as AAArray<U>;
    }

    public mapSerial<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, serial: true });
        return (this as unknown) as AAArray<U>;
    }

    /**
     * Arbitrarily mutate the array and return back to AAArray. This allows for any type of transformation to take
     * place (including those that require async functionality). The provided array is a copy of the current value
     * in the AAArray, it can be mutated as needed and then returned or an entirely new array can also be provided.
     * Direct mutations, such as setting a value at an index, do not affect the original array unless the modified
     * array is returned.
     *
     * @param callback Function that returns the new and/or transformed array.
     */
    public mutate<U>(callback: AAMutateCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MUTATE, callback });
        return (this as unknown) as AAArray<U>;
    }

    public async reduce<U>(callback: AAReduceCallback<T, U>, initialValue?: any): Promise<U> {
        const iv = typeof initialValue !== "undefined";
        const value = await this.value();
        if (!iv && !value.length) {
            throw new TypeError();
        } else {
            let acc = iv ? initialValue : value[0];
            for (let i = iv ? 0 : 1; i < value.length; ++i) {
                acc = await callback(acc, value[i], i, value);
            }
            return acc;
        }
    }

    public async reduceRight<U>(callback: AAReduceCallback<T, U>, initialValue?: any): Promise<U> {
        const iv = typeof initialValue !== "undefined";
        const value = await this.value();
        if (!iv && !value.length) {
            throw new TypeError();
        } else {
            let acc = iv ? initialValue : value[value.length - 1];
            for (let i = iv ? value.length - 1 : value.length - 2; i >= 0; --i) {
                acc = await callback(acc, value[i], i, value);
            }
            return acc;
        }
    }

    public reverse(): AAArray<T> {
        return this.mutate(arr => arr.reverse());
    }

    public slice(begin?: number, end?: number): AAArray<T> {
        return this.mutate(arr => arr.slice(begin, end));
    }

    public async some(callback: AAIterCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.value()).map((v, i, a) => callback(v, i, a)))).some(v => Boolean(v));
    }

    public async someSerial(callback: AAIterCallback<T>): Promise<boolean> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            if (await callback(value[i], i, value)) {
                return true;
            }
        }
        return false;
    }

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

    // TODO: pop?, push?, shift?, splice?, unshift?
    // These could be done with a final optional callback to handle the extra value while modifying the array as needed?

    public async value(): Promise<T[]> {
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
            const value = await this.value();
            return onfulfilled ? onfulfilled(value) : (value as any);
        } catch (err) {
            if (onrejected) {
                return onrejected(err);
            } else {
                throw err;
            }
        }
    }

    public async void(): Promise<void> {
        await this.value();
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

    protected async runMutate<U>(arr: T[], action: AAActionDelegate<AAMutateCallback<T, U>>): Promise<U[]> {
        const result = await action.callback(arr);
        return result || arr;
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

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}
