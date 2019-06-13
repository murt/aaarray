export type AAMapCallback<T, U> = (value: T, index: number, array: T[]) => U | Promise<U>;

export type AAFilterCallback<T> = (value: T, index: number, arr: T[]) => any;

// TODO: Investigate if we can actually see the full type of the callback as this might be handy in autocomp
// down the line - right now it only shows AAMapCallback for example instead of all the params actually needed.
type AACallback<T, U> = AAMapCallback<T, U> | AAFilterCallback<T>;

enum AAAction {
    MAP,
    FILTER,
}

type AAActionDelegate = { action: AAAction; callback: AACallback<any, any>; ordered: boolean };

export class AAArray<T> {
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

    public omap<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback, ordered: true });
        return (this as unknown) as AAArray<U>;
    }

    public filter(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, ordered: false });
        return this;
    }

    public ofilter(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback, ordered: true });
        return this;
    }

    public async value(): Promise<T[]> {
        let arr = this.array;
        while (this.queue.length) {
            arr = await this.run(arr, this.queue.shift() as AAActionDelegate);
        }
        return arr;
    }

    public async void(): Promise<void> {
        await this.value();
    }

    private async run(arr: any[], action: AAActionDelegate): Promise<any[]> {
        switch (action.action) {
            case AAAction.MAP:
                return this.runMap(arr, action);
            case AAAction.FILTER:
                return this.runFilter(arr, action);
            default:
                return arr;
        }
    }

    private async runMap(arr: any[], action: AAActionDelegate): Promise<any[]> {
        if (action.ordered) {
            for (let i = 0; i < arr.length; ++i) {
                arr[i] = await action.callback(arr[i], i, arr);
            }
            return arr;
        } else {
            return Promise.all(arr.map(action.callback));
        }
    }

    private async runFilter(arr: any[], action: AAActionDelegate): Promise<any[]> {
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
}

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}
