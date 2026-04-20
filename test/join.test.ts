import AA from "../src";

describe("aaarray#join", () => {
    it("should correctly join with default separator", async () => {
        const result = await AA([1, 2, 3]).join();
        expect(result).toEqual("1,2,3");
    });

    it("should correctly join with custom separator", async () => {
        const result = await AA([1, 2, 3]).join("-");
        expect(result).toEqual("1-2-3");
    });

    it("should work with empty arrays", async () => {
        const result = await AA([]).join();
        expect(result).toEqual("");
    });

    it("should work with single element", async () => {
        const result = await AA([1]).join();
        expect(result).toEqual("1");
    });

    it("should work with string arrays", async () => {
        const result = await AA(["a", "b", "c"]).join(", ");
        expect(result).toEqual("a, b, c");
    });

    it("should work with empty string separator", async () => {
        const result = await AA([1, 2, 3]).join("");
        expect(result).toEqual("123");
    });

    it("should handle mixed types", async () => {
        const result = await AA([1, "hello", 3]).join("|");
        expect(result).toEqual("1|hello|3");
    });
});
