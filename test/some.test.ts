import AA from "../src";

describe("aaarray#some", () => {
    it("should correctly resolve when async", async () => {
        const result = await AA([1, 2, 3]).some(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 2), 100);
                })
        );

        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).some(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 5), 100);
                })
        );

        expect(result2).toEqual(false);
    });

    it("should support sync functions", async () => {
        const result = await AA([1, 2, 3]).some(n => n > 2);
        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).some(n => n > 5);
        expect(result2).toEqual(false);
    });

    it("should return false for empty arrays", async () => {
        const result = await AA([]).some(n => n > 0);
        expect(result).toEqual(false);
    });
});
