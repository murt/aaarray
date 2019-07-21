export type AAMapCallback<T, U> = (value?: T, index?: number, array?: T[]) => U | Promise<U>;

export type AAFilterCallback<T> = (value?: T, index?: number, arr?: T[]) => any;

export type AATransform = (arr: any[]) => any[];

// TODO: Investigate if we can actually see the full type of the callback as this might be handy in autocomp
// down the line - right now it only shows AAMapCallback for example instead of all the params actually needed.
type AACallback<T, U> = AAMapCallback<T, U> | AAFilterCallback<T> | AATransform;

enum AAAction {
    MAP,
    FILTER,
    SLICE,
}

type AAActionDelegate<C = AACallback<any, any>> = { action: AAAction; callback: C; ordered: boolean };

export class AAArray<T> implements PromiseLike<T[]> {
    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[]) {
        this.array = array;
        this.queue = [];
    }

    public map<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, ordered: false });
        return (this as unknown) as AAArray<U>;
    }

    public mapOrdered<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, ordered: true });
        return (this as unknown) as AAArray<U>;
    }

    public filter(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, ordered: false });
        return this;
    }

    public filterOrdered(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, ordered: true });
        return this;
    }

    public slice(begin?: number, end?: number): AAArray<T> {
        this.queue.push({ action: AAAction.SLICE, callback: (arr: any[]) => arr.slice(begin, end), ordered: true });
        return this;
    }

    // TODO: find, findOrdered, slice, splice, join, reduce, reduceOrdered, reduceRightOrdered, concat, includes,
    // indexOf, lastIndexOf, findIndex, fill, flat, some, flatMap, pop, reverse, sort, unshift, forEach, push,
    // shift, every

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

    private async run(arr: any[], action: AAActionDelegate): Promise<any[]> {
        switch (action.action) {
            case AAAction.MAP:
                return this.runMap(arr, action as AAActionDelegate<AAMapCallback<T, any>>);
            case AAAction.FILTER:
                return this.runFilter(arr, action as AAActionDelegate<AAFilterCallback<T>>);
            case AAAction.SLICE:
                return this.runTransform(arr, action);
            default:
                return arr;
        }
    }

    private async runMap(arr: any[], action: AAActionDelegate<AAMapCallback<T, any>>): Promise<any[]> {
        if (action.ordered) {
            for (let i = 0; i < arr.length; ++i) {
                arr[i] = await action.callback(arr[i], i, arr);
            }
            return arr;
        } else {
            return Promise.all(arr.map(action.callback));
        }
    }

    private async runFilter(arr: any[], action: AAActionDelegate<AAFilterCallback<T>>): Promise<any[]> {
        let result = new Array(arr.length);
        if (action.ordered) {
            for (let i = 0; i < arr.length; ++i) {
                result[i] = await action.callback(arr[i], i, arr);
            }
        } else {
            result = await Promise.all(arr.map(action.callback));
        }
        return result.reduceRight((prev, cur, i) => (cur ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)]), arr);
    }

    private async runTransform(arr: any[], action: AAActionDelegate<AATransform>): Promise<any[]> {
        return action.callback(arr);
    }
}

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}
