import AA from "../src";

describe("aaarray#includes", () => {
    it("should correctly find included values", async () => {
        const result = await AA([1, 2, 3]).includes(2);
        expect(result).toEqual(true);
    });

    it("should return false for non-included values", async () => {
        const result = await AA([1, 2, 3]).includes(5);
        expect(result).toEqual(false);
    });

    it("should support fromIndex parameter", async () => {
        const result = await AA([1, 2, 3, 2]).includes(2, 2);
        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).includes(2, 2);
        expect(result2).toEqual(false);
    });

    it("should handle string values", async () => {
        const result = await AA(["a", "b", "c"]).includes("b");
        expect(result).toEqual(true);
    });

    it("should return false for empty arrays", async () => {
        const result = await AA<number>([]).includes(1);
        expect(result).toEqual(false);
    });

    it("should work with string arrays", async () => {
        const result = await AA(["1", "2", "3"]).includes("1");
        expect(result).toEqual(true);
    });
});
