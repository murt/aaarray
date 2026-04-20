import AA from "../src";

describe("aaarray#void", () => {
    it("should correctly return void", async () => {
        const result = await AA([1, 2, 3]).void();
        expect(result).toEqual(undefined);
    });

    it("should execute all queued operations", async () => {
        const results: number[] = [];
        await AA([1, 2, 3])
            .each(n => {
                results.push(n);
            })
            .void();

        expect(results).toContain(1);
        expect(results).toContain(2);
        expect(results).toContain(3);
    });

    it("should work with async operations", async () => {
        const results: number[] = [];
        await AA([1, 2, 3])
            .map(
                n =>
                    new Promise<number>(resolve => {
                        setTimeout(() => {
                            results.push(n);
                            resolve(n * 2);
                        }, 50);
                    })
            )
            .void();

        expect(results.length).toBeGreaterThan(0);
    });

    it("should work with empty arrays", async () => {
        const result = await AA([]).void();
        expect(result).toEqual(undefined);
    });

    it("should complete chained operations", async () => {
        const results: number[] = [];
        await AA([1, 2, 3])
            .filter(n => n > 1)
            .each(n => {
                results.push(n);
            })
            .void();

        expect(results).toEqual([2, 3]);
    });
});
