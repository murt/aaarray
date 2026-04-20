import AA from "../src";

describe("aaarray#someSerial", () => {
    it("should correctly resolve when async", async () => {
        const result = await AA([1, 2, 3]).someSerial(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 2), 100);
                })
        );

        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).someSerial(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 5), 100);
                })
        );

        expect(result2).toEqual(false);
    });

    it("should support sync functions", async () => {
        const result = await AA([1, 2, 3]).someSerial(n => n > 2);
        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).someSerial(n => n > 5);
        expect(result2).toEqual(false);
    });

    it("should return false for empty arrays", async () => {
        const result = await AA([]).someSerial(n => n > 0);
        expect(result).toEqual(false);
    });

    it("should process elements in serial order", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).someSerial(n => {
            results.push(n);
            return n > 2;
        });

        expect(results).toEqual([1, 2, 3]);
    });
});
