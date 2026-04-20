import AA from "../src";

describe("aaarray#reverse", () => {
    it("should correctly reverse array", async () => {
        const result = await AA([1, 2, 3, 4, 5]).reverse();
        expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it("should handle single element arrays", async () => {
        const result = await AA([1]).reverse();
        expect(result).toEqual([1]);
    });

    it("should handle empty arrays", async () => {
        const result = await AA([]).reverse();
        expect(result).toEqual([]);
    });

    it("should work with string arrays", async () => {
        const result = await AA(["a", "b", "c"]).reverse();
        expect(result).toEqual(["c", "b", "a"]);
    });

    it("should be chainable", async () => {
        const result = await AA([1, 2, 3])
            .reverse()
            .map(n => n * 2);

        expect(result).toEqual([6, 4, 2]);
    });

    it("should handle two-element arrays", async () => {
        const result = await AA([1, 2]).reverse();
        expect(result).toEqual([2, 1]);
    });
});
