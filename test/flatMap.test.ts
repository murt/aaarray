import AA from "../src";

describe("aaarray#flatMap", () => {
    it("should correctly flatMap with async functions", async () => {
        const result = await AA([1, 2, 3]).flatMap(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve([n, n * 2]), 50);
                })
        );

        expect(result).toEqual([[1, 2], [2, 4], [3, 6]]);
    });

    it("should support sync functions", async () => {
        const result = await AA([1, 2, 3]).flatMap(n => [n, n * 2]);
        expect(result).toEqual([[1, 2], [2, 4], [3, 6]]);
    });

    it("should handle functions returning single values", async () => {
        const result = await AA([1, 2, 3]).flatMap(n => n * 2);
        expect(result).toEqual([2, 4, 6]);
    });

    it("should handle functions returning empty arrays", async () => {
        const result = await AA([1, 2, 3]).flatMap(n => n > 2 ? [n] : []);
        expect(result).toEqual([[], [], [3]]);
    });

    it("should work with string arrays", async () => {
        const result = await AA(["hello", "world"]).flatMap(s => [s.toUpperCase()]);
        expect(result).toEqual([["HELLO"], ["WORLD"]]);
    });

    it("should be chainable after flatMap", async () => {
        const result = await AA([1, 2]).flatMap(n => [n]).map((arr: any) => arr[0] * 2);

        expect(result).toEqual([2, 4]);
    });
});
