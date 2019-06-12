/*
export interface AAMapCallback<T> {
    (value: T, index: number, arr: T[]): T | Promise<T>;
}
*/

export type AAMapCallback<T, U> = (value: T, index: number, array: T[]) => U | Promise<U>;

export type AAFilterCallback<T> = (value: T, index: number, arr: T[]) => any;

type AACallback<T, U> = AAMapCallback<T, U> | AAFilterCallback<T>;

enum AAAction {
    MAP,
    FILTER,
}

type AAActionDelegate = { action: AAAction; callback: AACallback<any, any> };

export class AAArray<T> {
    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[]) {
        this.array = array;
        this.queue = [];
    }

    public map<U>(callback: AAMapCallback<T, U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, callback });
        return (this as unknown) as AAArray<U>;
    }

    public filter(callback: AAFilterCallback<T>): AAArray<T> {
        this.queue.push({ action: AAAction.FILTER, callback });
        return this;
    }

    public async value(): Promise<T[]> {
        let arr = this.array;
        while (this.queue.length) {
            arr = await this.run(arr, this.queue.shift() as AAActionDelegate);
        }
        return arr;
    }

    private async run(arr: any[], item: AAActionDelegate): Promise<any[]> {
        switch (item.action) {
            case AAAction.MAP:
                return Promise.all(arr.map(item.callback));
            case AAAction.FILTER:
                return (await Promise.all(arr.map(item.callback))).reduceRight(
                    (prev, cur, i) => (cur ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)]),
                    arr
                );
            default:
                return arr;
        }
    }
}

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}
