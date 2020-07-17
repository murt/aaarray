import AA from "../src/aaarray";

describe("aaarray#pop", () => {
    it("should provide the last element", async () => {
        const result = await AA([1,2,3]).pop();
        expect(result).toBe(3);
    });
});
