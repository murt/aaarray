import AA from "../src/aaarray";

describe("aaarray#flat", () => {
    it("should flatten an array to a single depth by default", async () => {
        const results = await AA([[1], [2], [3]]).flat();
        expect(results).toEqual([1,2,3]);
    });

    it("should flatten to multiple depths", async () => {
        const results = await AA([[[1]], [[2]], [[3]]]).flat(2);
        expect(results).toEqual([1,2,3]);
    });
});