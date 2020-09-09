import AA from "../src";

describe("aaarray#each", () => {
    it("should not mutate the original array even if not returning", async () => {
        let counter = 0;
        const results = await AA([1, 2, 3, 4]).each(n => {
            counter += n;
        });
        expect(results).toEqual([1, 2, 3, 4]);
        expect(counter).toEqual(10);
    });

    it("should not mutate the original array even if returning", async () => {
        let counter = 0;
        const results = await AA([1, 2, 3, 4]).each(async n => {
            return new Promise(resolve => {
                setTimeout(resolve, 100);
            }).then(() => (counter += n));
        });
        expect(results).toEqual([1, 2, 3, 4]);
        expect(counter).toEqual(10);
    });
});
