import AA from "../src";

describe("aaarray#slice", () => {
    it("should correctly slice array with begin and end", async () => {
        const result = await AA([1, 2, 3, 4, 5]).slice(1, 4);
        expect(result).toEqual([2, 3, 4]);
    });

    it("should support negative indices", async () => {
        const result = await AA([1, 2, 3, 4, 5]).slice(-2);
        expect(result).toEqual([4, 5]);

        const result2 = await AA([1, 2, 3, 4, 5]).slice(-3, -1);
        expect(result2).toEqual([3, 4]);
    });

    it("should return full array when no parameters provided", async () => {
        const result = await AA([1, 2, 3]).slice();
        expect(result).toEqual([1, 2, 3]);
    });

    it("should return empty array when start >= array length", async () => {
        const result = await AA([1, 2, 3]).slice(5);
        expect(result).toEqual([]);
    });

    it("should handle begin only", async () => {
        const result = await AA([1, 2, 3, 4, 5]).slice(2);
        expect(result).toEqual([3, 4, 5]);
    });

    it("should be chainable", async () => {
        const result = await AA([1, 2, 3, 4, 5])
            .slice(1, 4)
            .map(n => n * 2);

        expect(result).toEqual([4, 6, 8]);
    });
});
