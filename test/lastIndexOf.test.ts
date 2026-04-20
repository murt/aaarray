import AA from "../src";

describe("aaarray#lastIndexOf", () => {
    it("should find first index of value (fromIndex defaults to 0)", async () => {
        const result = await AA([1, 2, 3, 2]).lastIndexOf(2, 0);
        expect(result).toEqual(-1);
    });

    it("should return -1 for non-included values", async () => {
        const result = await AA([1, 2, 3]).lastIndexOf(5, 0);
        expect(result).toEqual(-1);
    });

    it("should find occurrence with high fromIndex", async () => {
        const result = await AA([1, 2, 2, 3]).lastIndexOf(2, 3);
        expect(result).toEqual(2);
    });

    it("should return -1 for empty arrays", async () => {
        const result = await AA<number>([]).lastIndexOf(1);
        expect(result).toEqual(-1);
    });

    it("should handle single element array", async () => {
        const result = await AA([2]).lastIndexOf(2, 0);
        expect(result).toEqual(0);
    });

    it("should support fromIndex parameter", async () => {
        const result = await AA([1, 2, 3, 2, 1]).lastIndexOf(2, 2);
        expect(result).toEqual(1);
    });
});
