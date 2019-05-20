// TODO: Index accessors? Supporting for-in or for-of? toString to print scalar values?
export interface AAArray {
    map: (callback: AAMapDelegate) => Promise<AAArray>;
    toArray: () => any[];
}

export interface AAMapDelegate {
    (value: any, index: number, arr: any[]): Promise<any>;
}