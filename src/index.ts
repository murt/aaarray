export interface AAMapDelegate<T> {
    (value: T, index: number, arr: T[]): T | Promise<T>;
}

export interface AAFilterDelegate<T> {
    (value: T, index: number, arr: T[]): Boolean | T | Promise<Boolean> | Promise<T>;
}

type AADelegate<T> = AAMapDelegate<T> | AAFilterDelegate<T>;

const enum AAction {
    MAP = "map",
    FILTER = "filter",
};

interface AAActionEntry<T> {
    action: AAction;
    delegate: AADelegate<T>;
}

export class AAArray<T> {
    private array: T[];
    private readonly queue: AAActionEntry<T>[];

    public constructor(array: Array<T>) {
        this.array = array;
        this.queue = [];
    }

    public get length() {
        return this.array.length;
    }

    public toArray(): T[] {
        return this.array;
    }

    public toString(): string {
        return this.array.toString();
    }

    public map(callback: AAMapDelegate<T>): AAArray<any> {
        this.action(AAction.MAP, callback);
        return this as AAArray<any>;
    }

    public filter(callback: AAFilterDelegate<T>): AAArray<T> {
        this.action(AAction.FILTER, callback);
        return this;
    }

    public async run(): Promise<AAArray<T>> {
        while (this.queue.length) {
            await this.runAction(this.queue.shift() as AAActionEntry<T>);
        }
        return this;
    }

    public async value(): Promise<T[]> {
        return (await this.run()).toArray();
    }

    private action(action: AAction, delegate: AADelegate<T>): void {
        this.queue.push({ action, delegate });
    }

    private async runAction(entry: AAActionEntry<T>): Promise<void> {
        switch (entry.action) {
            case AAction.MAP:
                await this.runMap(entry.delegate as AAMapDelegate<T>);
                break;
            case AAction.FILTER:
                await this.runFilter(entry.delegate as AAFilterDelegate<T>);
                break
        }
    }

    private async runMap(callback: AAMapDelegate<T>): Promise<void> {
        this.array = await Promise.all(this.array.map(callback));
    }

    private async runFilter(callback: AAFilterDelegate<T>): Promise<void> {
        this.array = await Promise.all(this.array.filter(callback));
    }
}

/**
 * Entrypoint for all aaarray functionality.
 *
 * @param array Array value that will be used to initialise the AAArray
 * @returns New AAArray object
 */
export default function AA<U>(array: Array<U>): AAArray<U> {
    return new AAArray<U>(array);
}
