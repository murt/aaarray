import { AAArray, AAMapDelegate } from "./types";

export default function AA(array: Array<any>): AAArray {
    return {
        map: async (callback: AAMapDelegate) => {
            return Promise.all(array.map((value, index, arr) => new Promise((resolve, reject) => {}))).then(AA);
        },
    };
}
