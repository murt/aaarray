import AA from "../src";

describe("aaarray#unshift", () => {
    it("should correctly add element to start of array", async () => {
        const result = await AA([2, 3]).unshift(1);
        expect(result).toEqual([1, 2, 3]);
    });

    it("should work with single element array", async () => {
        const result = await AA([2]).unshift(1);
        expect(result).toEqual([1, 2]);
    });

    it("should work with empty array", async () => {
        const result = await AA([]).unshift(1);
        expect(result).toEqual([1]);
    });

    it("should support different types", async () => {
        const result = await AA([2, 3]).unshift("a");
        expect(result).toEqual(["a", 2, 3]);
    });

    it("should be chainable", async () => {
        const result = await AA([2, 3])
            .unshift(1)
            .map(n => n * 2);

        expect(result).toEqual([2, 4, 6]);
    });

    it("should handle multiple consecutive unshifts", async () => {
        const result = await AA([3])
            .unshift(2)
            .unshift(1);

        expect(result).toEqual([1, 2, 3]);
    });
});
