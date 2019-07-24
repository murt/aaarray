import AA from "../src";

describe("aaarray#fill", () => {
    it("should fill array with same type", async () => {
        const result = await AA([1, 2, 3]).fill(0);
        expect(result).toEqual([0, 0, 0]);
    });

    it("should fill array with different type", async () => {
        const result = await AA([1, 2, 3]).fill("0");
        expect(result).toEqual(["0", "0", "0"]);
    });

    it("should fill with a mixed result", async () => {
        const result = await AA([1, 2, 3]).fill("0", 1, 2);
        expect(result).toEqual([1, "0", 3]);
    });
});
