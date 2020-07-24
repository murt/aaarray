import AA from "../src";

describe("aaarray#reduce", () => {
    it("should reduce without an initial value", async () => {
        const results = await AA([0, 1, 2, 3, 4]).reduce((prev, cur) => prev + cur);
        expect(results).toEqual(10);
    });

    it("should reduce with an initial value", async () => {
        const results = await AA([0, 1, 2, 3, 4]).reduce((prev, cur) => prev + cur, 10);
        expect(results).toEqual(20);
    });

    it("should reduce with mixed types", async () => {
        // While this is valid the type is technically incorrect as the first time
        // we see "prev" it is a number and then the next it's a string
        // @ts-expect-error
        const results = await AA([1, 2, 3]).reduce((prev, cur) => `${prev}${cur}`);
        expect(results).toEqual("123");

        const results2 = await(AA(["1","2","3"]).reduce((prev, cur) => prev + parseInt(cur), 0));
        expect(results2).toEqual(6);
    });
});
