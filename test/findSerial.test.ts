import AA from "../src";

describe("aaarray#findSerial", () => {
    it("should find a value asynchronously in serial", async () => {
        const result = await AA([
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
        ]).findSerial(async ({ x }) => {
            return new Promise(resolve => {
                setTimeout(() => resolve(x === 1), 10);
            });
        });

        expect(result).toEqual({ x: 1, y: 1 });
    });

    it("should find a value synchronously in serial", async () => {
        const result = await AA([
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
        ]).findSerial(({ x }) => x === 1);

        expect(result).toEqual({ x: 1, y: 1 });
    });

    it("should return undefined if no value is found in serial", async () => {
        const result = await AA([
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
        ]).findSerial(({ x }) => x === 3);

        expect(result).toBeUndefined();
    });

    it("should return undefined on an empty array in serial", async () => {
        const result = await AA([]).findSerial(() => true);
        expect(result).toBeUndefined();
    });
});
