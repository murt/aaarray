export type AAMapCallback<T, U> = (value: T, index: number, arr: T[]) => U | Promise<U>;

// TODO: These are all just... super the same, could easily be a single type
export type AAFilterCallback<T> = (value: T, index: number, arr: T[]) => any;

export type AAFindCallback<T> = (value: T, index: number, arr: T[]) => any;

export type AASomeCallback<T> = (value: T, index: number, arr: T[]) => any;

export type AAEveryCallback<T> = (value: T, index: number, arr: T[]) => any;

export type AATransform<T> = (arr: T[]) => T[];

// TODO: Investigate if we can actually see the full type of the callback as this might be handy in autocomp
// down the line - right now it only shows AAMapCallback for example instead of all the params actually needed.
type AACallback<T, U> = AAMapCallback<T, U> | AAFilterCallback<T> | AATransform<T>;

enum AAAction {
    CONCAT,
    FILTER,
    MAP,
    SLICE,
}

type AAActionDelegate<C = AACallback<any, any>> = { action: AAAction; callback: C; serial?: boolean };

export class AAArray<T> implements PromiseLike<T[]> {
    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[]) {
        this.array = array;
        this.queue = [];
    }

    public concat<U>(...values: (T | U | ConcatArray<T | U>)[]): AAArray<T | U> {
        this.queue.push({
            action: AAAction.CONCAT,
            callback: (arr: T[]) => (arr as (T | U)[]).concat(...values),
        });
        return (this as unknown) as AAArray<T | U>;
    }

    public async every(callback: AAEveryCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.value()).map((v, i, a) => callback(v, i, a)))).every(v => Boolean(v));
    }

    public async everySerial(callback: AAEveryCallback<T>): Promise<boolean> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            if (!(await callback(value[i], i, value))) {
                return false;
            }
        }
        return true;
    }

    public filter(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: false });
        return this;
    }

    public filterSerial(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, serial: true });
        return this;
    }

    public async find(callback: AAFindCallback<T>): Promise<T | undefined> {
        const value = await this.value();
        const results = await Promise.all(
            value.map(async (v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
        );
        return value[results.indexOf(true)];
    }

    public async findIndex(callback: AAFindCallback<T>): Promise<number> {
        return (await Promise.all(
            (await this.value()).map(async (v, i, a) => callback(v, i, a).then((r: any) => (r ? true : false)))
        )).indexOf(true);
    }

    public async findIndexSerial(callback: AAFindCallback<T>): Promise<number> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return i;
            }
        }
        return -1;
    }

    public async findSerial(callback: AAFindCallback<T>): Promise<T | undefined> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            const result = await callback(value[i], i, value);
            if (result) {
                return result;
            }
        }
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

    public slice(begin?: number, end?: number): AAArray<T> {
        this.queue.push({ action: AAAction.SLICE, callback: (arr: any[]) => arr.slice(begin, end) });
        return this;
    }

    public async some(callback: AASomeCallback<T>): Promise<boolean> {
        return (await Promise.all((await this.value()).map((v, i, a) => callback(v, i, a)))).some(v => Boolean(v));
    }

    public async someSerial(callback: AASomeCallback<T>): Promise<boolean> {
        const value = await this.value();
        for (let i = 0; i < value.length; ++i) {
            if (await callback(value[i], i, value)) {
                return true;
            }
        }
        return false;
    }

    // TODO: splice?, reduce, reduceSerial, reduceRightSerial
    // fill, flat, flatMap, pop?, reverse, sort, unshift?, forEach, push?,
    // shift?

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
            case AAAction.FILTER:
                return this.runFilter(arr, action as AAActionDelegate<AAFilterCallback<T>>);
            case AAAction.MAP:
                return this.runMap(arr, action as AAActionDelegate<AAMapCallback<T, any>>);
            case AAAction.CONCAT:
            case AAAction.SLICE:
                return this.runTransform(arr, action as AAActionDelegate<AATransform<T>>);
            default:
                return arr;
        }
    }

    private async runMap(arr: any[], action: AAActionDelegate<AAMapCallback<T, any>>): Promise<any[]> {
        if (action.serial) {
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
        if (action.serial) {
            for (let i = 0; i < arr.length; ++i) {
                result[i] = await action.callback(arr[i], i, arr);
            }
        } else {
            result = await Promise.all(arr.map(action.callback));
        }
        return result.reduceRight((prev, cur, i) => (cur ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)]), arr);
    }

    private async runTransform(arr: any[], action: AAActionDelegate<AATransform<T>>): Promise<any[]> {
        return action.callback(arr);
    }
}

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}
