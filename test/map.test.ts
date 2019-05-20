import AA from "../src";

describe("aaarray#map", () => {
    it("should support async functions", async () => {
        const results = await AA([1,2,3]).map(async n => new Promise((resolve, reject) => {
            setTimeout(() => resolve(n * 2), 500);
        }));

        expect(results.toArray()).toEqual([2,4,6]);
    });

    it.skip("should support sync functions", () => {
    });
});