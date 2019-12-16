import AA from "../src";

describe("aaarray#async", () => {
    it("should allow async await without value calls", async () => {
        // @ts-ignore
        const result = await AA([1,2,3]).map(n => n+1);
        expect(result).toEqual([2,3,4]);
    });
});