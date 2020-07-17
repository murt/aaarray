import AA from "../src/aaarray";

describe("aaarray#map", () => {
    it("should support async functions", async () => {
        const results = await AA([1, 2, 3]).map(
            async n =>
                new Promise<number>(resolve => {
                    setTimeout(() => resolve(n * 2), 100);
                })
        );

        expect(results).toEqual([2, 4, 6]);
    });

    it("should support sync functions", async () => {
        const results = await AA([1, 2, 3]).map(n => n * 2);
        expect(results).toEqual([2, 4, 6]);
    });

    it("should support async functions without await", async () => {
        // eslint-disable-next-line @typescript-eslint/require-await
        const results = await AA([1, 2, 3]).map(async n => n * 2);
        expect(results).toEqual([2, 4, 6]);
    });

    it("should support chained maps", async () => {
        const results = await AA([1, 2, 3])
            .map(n => n * 2)
            .map(n => n * 3);
        expect(results).toEqual([6, 12, 18]);
    });

    it("should support multiple types", async () => {
        const results = await AA([1, 2, 3]).map(n => `test-${n}`);
        expect(results).toEqual(["test-1", "test-2", "test-3"]);
    });

    // This test is designed to let the first callback finish and assign to the first index of the result array.
    // Giving each successive callback a shorter timeout ensures that if they were to run out of order they would
    // push their result out of order too.
    it("should support serial mapping", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).mapSerial(
            (n: number, i: number, array: number[]) =>
                new Promise(resolve => {
                    setTimeout(() => {
                        results.push(n);
                        resolve(n);
                    }, (array.length - i) * 100);
                })
        );
        expect(results).toEqual([1, 2, 3]);
    });
});
