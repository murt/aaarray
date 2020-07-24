import AA from "../src";

describe("aaarray#mutate", () => {

    // This test is a little funny - Typescript will require that an array value be returned but Javascript will
    // allow any kind of shenanigans here, hence why I tell the type checker to take a hike for this one.
    // If nothing is returned then theoretically the original array should be returned.
    it("should not alter the original array", async () => {
        const results = await AA([1, 2, 3]).mutate((arr): any => {
            // Set the value at an index of the provided array but don't *actually* return anything. This should
            // not actually change anything as nothing is returned.
            arr[0] = 4;
        });

        expect(results).toEqual([1, 2, 3]);
    });

    it("should support altering an entry", async () => {
        const results = await AA([1, 2, 3]).mutate(arr => {
            arr[0] = 4;
            return arr;
        });

        expect(results).toEqual([4, 2, 3]);
    });

});
