import AA from "../src";
import timerPromise from "./utils/timer-promise";

describe("AAArray#findIndex", () => {
    it("should find the index of a value asynchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndex(timerPromise(v => v === "b"));
        expect(result).toBe(1);
    });

    it("should return -1 when an index cannot be found asynchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndex(timerPromise(v => v === "d"));
        expect(result).toBe(-1);
    });

    it("should find the index of a value synchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndex(v => v === "b");
        expect(result).toBe(1);
    });

    it("should return -1 when an index cannot be found synchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndex(v => v === "d");
        expect(result).toBe(-1);
    });
});
