export interface AAMapDelegate<T> {
    (value: T, index: number, arr: T[]): unknown | Promise<unknown>;
}

export interface AAFilterDelegate<T> {
    (value: T, index: number, arr: T[]): any;
}

type AADelegate<T> = AAMapDelegate<T> | AAFilterDelegate<T>;

enum AAAction {
    MAP,
    FILTER,
}

export class AAArray<T> {

    protected action?: { name: AAAction, delegate: AADelegate<T> };

    protected readonly parent?: AAArray<any>;

    protected readonly array: Array<T>;

    public constructor(array: Array<T>, parent?: AAArray<any>) {
        this.parent = parent;
        this.array = array;
    }

    public map(callback: AAMapDelegate<T>): AAArray<unknown> {
        this.action = { name: AAAction.MAP, delegate: callback };
        type response = ReturnType<typeof callback>;
        return new AAArray(this.array as response[], this);
    }

    public async value(): Promise<T[]> {
        return Promise.resolve(this.array); 
    }

}