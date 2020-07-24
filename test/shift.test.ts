import AA from "../src";

describe("aaarray#shift", () => {
    it("should provide the first element", async () => {
        const result = await AA([1,2,3]).shift();
        expect(result).toBe(1);
    });
});
