import AA from "../src";

describe("aaarray#map", () => {
    it("should support async functions", async () => {
        const results = await AA([1, 2, 3]).map(
            async n =>
                await new Promise<typeof n>((resolve, reject) => {
                    setTimeout(() => resolve(n * 2), 500);
                })
        );

        expect(results.toArray()).toEqual([2, 4, 6]);
    });

    it("should support sync functions", async () => {
        const results = await AA([1, 2, 3]).map(n => n * 2);
        expect(results.toArray()).toEqual([2, 4, 6]);
    });
});
