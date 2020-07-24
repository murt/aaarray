import AA from "../src";

describe("aaarray#every", () => {
    it("should correctly resolve when async", async () => {
        const result = await AA([1, 2, 3]).every(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 0), 100);
                })
        );

        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).every(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n < 0), 100);
                })
        );

        expect(result2).toEqual(false);
    });

    it("should correctly resolve when async in serial", async () => {
        const result = await AA([1, 2, 3]).everySerial(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n > 0), 100);
                })
        );

        expect(result).toEqual(true);

        const result2 = await AA([1, 2, 3]).everySerial(
            async n =>
                new Promise(resolve => {
                    setTimeout(() => resolve(n < 0), 100);
                })
        );

        expect(result2).toEqual(false);
    });
});
