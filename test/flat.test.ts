import AA from "../src";

describe("aaarray#flat", () => {
    it("should flatten an array to a single depth by default", async () => {
        const results = await AA([[1], [2], [3]]).flat();
        expect(results).toEqual([1,2,3]);
    });

    it("should flatten to multiple depths", async () => {
        const results = await AA([[[1]], [[2]], [[3]]]).flat(2);
        expect(results).toEqual([1,2,3]);
    });

    it("should retain nested arrays", async () => {
        const results = await AA([[[1]], [[2]], [[3]]]).flat();
        expect(results).toStrictEqual([[1],[2],[3]]);
    });
});