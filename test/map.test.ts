import AA, { AAArray } from "../src";

describe("aaarray#map", () => {
    it("should support async functions", async () => {
        const results = await AA([1, 2, 3])
            .map(
                async n =>
                    await new Promise<number>((resolve, reject) => {
                        setTimeout(() => resolve(n * 2), 500);
                    })
            )
            .value();

        expect(results).toEqual([2, 4, 6]);
    });

    it("should support sync functions", async () => {
        const results = await AA([1, 2, 3])
            .map(n => n * 2)
            .value();
        expect(results).toEqual([2, 4, 6]);
    });

    it("should support async functions without await", async () => {
        const results = await AA([1, 2, 3])
            .map(async n => n * 2)
            .value();
        expect(results).toEqual([2, 4, 6]);
    });

    it("should support chained maps", async () => {
        const results = await AA([1, 2, 3])
            .map(async n => n * 2)
            .map(async n => n * 3)
            .value();
        expect(results).toEqual([6, 12, 18]);
    });

    it("should support multiple types", async () => {
        const results = await AA([1, 2, 3])
            .map(async n => `test-${n}`)
            .value();
        expect(results).toEqual(["test-1", "test-2", "test-3"]);
    });
});
