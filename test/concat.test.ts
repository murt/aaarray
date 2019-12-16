import AA from "../src/aaarray";

describe("aaarray#concat", () => {
    it("should concat spread args", async () => {
        const results = await AA([1, 2, 3]).concat(4, 5, 6);
        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should flatten and concat arrays", async () => {
        const results = await AA([1, 2, 3]).concat([4, 5, 6]);
        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should support mixed parameters", async () => {
        const results = await AA([1, 2, 3]).concat(4, [5, 6]);
        expect(results).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should support single level flattening", async () => {
        const results = await AA([1, 2, 3]).concat([[4, 5], 6]);
        expect(results).toEqual([1, 2, 3, [4, 5], 6]);
    });

    it("should support mixed types", async () => {
        const results = await AA([1, 2, 3]).concat("four", "five", "six");
        expect(results).toEqual([1, 2, 3, "four", "five", "six"]);
    });
});
