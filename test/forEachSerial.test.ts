import AA from "../src";

describe("aaarray#forEachSerial", () => {
    it("should correctly iterate with async callback", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).forEachSerial(
            async n =>
                new Promise<void>(resolve => {
                    setTimeout(() => {
                        results.push(n);
                        resolve();
                    }, 50);
                })
        );

        expect(results).toEqual([1, 2, 3]);
    });

    it("should support sync functions", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).forEachSerial(n => {
            results.push(n);
        });

        expect(results).toEqual([1, 2, 3]);
    });

    it("should process elements in serial order", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).forEachSerial(
            n =>
                new Promise<void>(resolve => {
                    setTimeout(() => {
                        results.push(n);
                        resolve();
                    }, (4 - n) * 50);
                })
        );

        expect(results).toEqual([1, 2, 3]);
    });

    it("should return undefined", async () => {
        const result = await AA([1, 2, 3]).forEachSerial(() => {});
        expect(result).toEqual(undefined);
    });

    it("should handle empty arrays", async () => {
        const results: number[] = [];
        await AA<number>([]).forEachSerial(n => {
            results.push(n);
        });

        expect(results).toEqual([]);
    });

    it("should receive index and array parameters", async () => {
        const indices: number[] = [];
        await AA([10, 20, 30]).forEachSerial((n, i, arr) => {
            indices.push(i);
            expect(arr).toEqual([10, 20, 30]);
        });

        expect(indices).toEqual([0, 1, 2]);
    });
});
