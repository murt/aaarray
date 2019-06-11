/*
export interface AAMapDelegate<T> {
    (value: T, index: number, arr: T[]): T | Promise<T>;
}
*/

export type AAMapDelegate<T,U> = (value: T, index: number, array: T[]) => U | Promise<U>;

export type AAFilterDelegate<T> = (value: T, index: number, arr: T[]) => any;

type AADelegate<T,U> = AAMapDelegate<T,U> | AAFilterDelegate<T>;

enum AAAction {
    MAP,
    FILTER,
}

type AAActionDelegate = { action: AAAction, delegate: AADelegate<any, any> };

export class AAArray<T> {

    protected readonly array: T[];

    protected readonly queue: AAActionDelegate[];

    public constructor(array: T[]) {
        this.array = array;
        this.queue = [];
    }

    public map<U>(callback: AAMapDelegate<T,U>): AAArray<U> {
        this.queue.push({ action: AAAction.MAP, delegate: callback });
        return this as unknown as AAArray<U>;
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
                return Promise.all(arr.map(item.delegate)); 
            default:
                return arr;
        }
    }

}

export default function AA<U>(array: U[]): AAArray<U> {
    return new AAArray<U>(array);
}