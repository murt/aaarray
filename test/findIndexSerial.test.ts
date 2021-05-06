import AA from "../src";
import timerPromise from "./utils/timer-promise";

describe("AAArray#findIndexSerial", () => {
    it("should find the index of a value asynchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndexSerial(timerPromise(v => v === "b"));
        expect(result).toBe(1);
    });

    it("should return -1 when an index cannot be found asynchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndexSerial(timerPromise(v => v === "d"));
        expect(result).toBe(-1);
    });

    it("should find the index of a value synchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndexSerial(v => v === "b");
        expect(result).toBe(1);
    });

    it("should return -1 when an index cannot be found synchronously", async () => {
        const result = await AA(["a", "b", "c"]).findIndexSerial(v => v === "d");
        expect(result).toBe(-1);
    });
});

