export interface AAArray {
    map: (callback: AAMapDelegate) => Promise<AAArray>;
}

export interface AAMapDelegate {
    (value: any, index: number, arr: any[]): Promise<any>;
}