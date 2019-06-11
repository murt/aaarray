export interface AAMapDelegate<T> {
    (value: T, index: number, arr: T[]): T | Promise<T>;
}

export interface AAFilterDelegate<T> {
    (value: T, index: number, arr: T[]): any;
}

type AADelegate<T> = AAMapDelegate<T> | AAFilterDelegate<T> | any;

enum AAAction {
    MAP,
    FILTER,
}

export class AAArray<T> {

    protected action?: { name: AAAction, delegate: AADelegate<T> };

    protected readonly parent?: AAArray<any>;

    protected readonly array?: Array<T> | null;

    public constructor(array?: Array<T>, parent?: AAArray<any>) {
        this.parent = parent;
        this.array = array;
    }

    public map<U>(callback: (value: T, index: number, array: T[]) => U | Promise<U>): AAArray<U> {
        this.action = { name: AAAction.MAP, delegate: callback };
        return new AAArray<U>(undefined, this);
    }

    public async value(): Promise<T[]> {
        return Promise.resolve([]); 
    }

}

export default function AA<U>(array: Array<U>): AAArray<U> {
    return new AAArray<U>(array);
}