import AA from "../src";

describe("aaarray#mutate", () => {
    it("should support altering an entry", async () => {
        const results = await AA([1, 2, 3]).mutate(arr => {
            arr[0] = 4;
            return arr;
        });

        expect(results).toEqual([4, 2, 3]);
    });
});
