import AA from "../src";

describe("aaarray#forEach", () => {
    it("should return undefined", async () => {
        let counter = 0;
        const results = await AA([1, 2, 3, 4]).forEach(n => {
            counter += n;
        });
        expect(results).toEqual(undefined);
        expect(counter).toEqual(10);
    });
});
