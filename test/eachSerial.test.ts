import AA from "../src";

describe("aaarray#eachSerial", () => {
    it("should support serial each", async () => {
        const counters: number[] = [];
        const results = await AA([1, 2, 3]).eachSerial((n: number, i: number, array: number[]) =>
            new Promise(resolve => {
                setTimeout(resolve, (array.length - i) * 100);
            }).then(() => counters.push(n * 2))
        );
        expect(results).toEqual([1, 2, 3]);
        expect(counters).toEqual([2, 4, 6]);
    });
});
