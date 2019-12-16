import AA from "../src/aaarray";

describe("aaarray#reduce", () => {
    it("should reduce without an initial value", async () => {
        const results = await AA([0, 1, 2, 3, 4]).reduce((prev, cur) => prev + cur);
        expect(results).toEqual(10);
    });

    it("should reduce with an initial value", async () => {
        const results = await AA([0, 1, 2, 3, 4]).reduce((prev, cur) => prev + cur, 10);
        expect(results).toEqual(20);
    });
});
