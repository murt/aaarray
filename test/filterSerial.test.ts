import AA from "../src";

describe("aaarray#filterSerial", () => {
    it("should correctly filter with async callback", async () => {
        const result = await AA([1, 2, 3, 4, 5]).filterSerial(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 2), 50);
                })
        );

        expect(result).toEqual([3, 4, 5]);
    });

    it("should support sync functions", async () => {
        const result = await AA([1, 2, 3, 4, 5]).filterSerial(n => n > 2);
        expect(result).toEqual([3, 4, 5]);
    });

    it("should return empty array when no elements match", async () => {
        const result = await AA([1, 2, 3]).filterSerial(n => n > 5);
        expect(result).toEqual([]);
    });

    it("should return full array when all elements match", async () => {
        const result = await AA([1, 2, 3]).filterSerial(n => n > 0);
        expect(result).toEqual([1, 2, 3]);
    });

    it("should process elements in serial order", async () => {
        const results: number[] = [];
        await AA([1, 2, 3]).filterSerial(n => {
            results.push(n);
            return n > 1;
        });

        expect(results).toEqual([1, 2, 3]);
    });

    it("should be chainable", async () => {
        const result = await AA([1, 2, 3, 4, 5])
            .filterSerial(n => n > 2)
            .map(n => n * 2);

        expect(result).toEqual([6, 8, 10]);
    });
});
