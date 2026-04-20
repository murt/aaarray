import AA from "../src";

describe("aaarray#indexOf", () => {
    it("should correctly find first index of value", async () => {
        const result = await AA([1, 2, 3]).indexOf(2);
        expect(result).toEqual(1);
    });

    it("should return -1 for non-included values", async () => {
        const result = await AA([1, 2, 3]).indexOf(5);
        expect(result).toEqual(-1);
    });

    it("should support fromIndex parameter", async () => {
        const result = await AA([1, 2, 3, 2]).indexOf(2, 2);
        expect(result).toEqual(3);

        const result2 = await AA([1, 2, 3]).indexOf(2, 2);
        expect(result2).toEqual(-1);
    });

    it("should find first occurrence when value appears multiple times", async () => {
        const result = await AA([1, 2, 2, 3]).indexOf(2);
        expect(result).toEqual(1);
    });

    it("should return -1 for empty arrays", async () => {
        const result = await AA<number>([]).indexOf(1);
        expect(result).toEqual(-1);
    });

    it("should use strict equality", async () => {
        const result = await AA([1, 2, 3]).indexOf(2);
        expect(result).toEqual(1);
    });
});
