import AA from "../src/aaarray";

describe("aaarray#sort", () => {
    it("should sort basic numbers without a compare function", async () => {
        const results = await AA([4, 2, 5, 1, 3]).sort();
        expect(results).toEqual([1, 2, 3, 4, 5]);
    });
});
