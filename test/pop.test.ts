import AA from "../src";

describe("aaarray#pop", () => {
    it("should provide the last element", async () => {
        const result = await AA([1,2,3]).pop();
        expect(result).toBe(3);
    });

    it("should confirm that the AAArray is altered", async () => {
        const arr = AA([1,2,3]);
        const result = await arr.pop();
        expect(result).toBe(3);
        expect(await arr.length()).toBe(2);
        expect(await arr.last()).toBe(2);
    });
});
