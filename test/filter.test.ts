import AA from "../src/aaarray";

describe("aaarray#filter", () => {
    it("should support async functions", async () => {
        const results = await AA([1, 2, 3]).filter(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n === 2), 100);
                })
        );

        expect(results).toEqual([2]);
    });

    it("should support removing truthy values", async () => {
        const results = await AA([false, true, false]).filter(x => x === false);
        expect(results).toEqual([false, false]);
    });

    it("should support removing specific falsy values", async () => {
        const results = await AA([false, null, false]).filter(x => x === false);
        expect(results).toEqual([false, false]);
    });

    it("should support using a bound function (Boolean)", async () => {
        const results = await AA([1, 0, true, false]).filter(Boolean);
        expect(results).toEqual([1, true]);
    });
});
