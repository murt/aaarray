import AA from "../src";

describe("aaarray#find", () => {
    it("should find a value asynchronously", async () => {
        const result = await AA([{ x: 1 }, { x: 2 }, { x: 3 }]).find(async ({ x }) => {
            return new Promise(resolve => {
                setTimeout(() => resolve(x === 3), 10);
            });
        });

        expect(result).toEqual({ x: 3 });
    });

    it("should find the first value found asynchronously", async () => {
        const result = await AA([
            { x: 1, y: 100 },
            { x: 1, y: 10 },
            { x: 1, y: 100 },
        ]).find(async ({ x, y }) => {
            return new Promise(resolve => {
                setTimeout(() => resolve(x === 1), y);
            });
        });

        expect(result).toEqual({ x: 1, y: 10 });
    });

    it("should find a value synchronously", async () => {
        const result = await AA([{ x: 1 }, { x: 2 }, { x: 3 }]).find(({ x }) => {
            return x === 3;
        });

        expect(result).toEqual({ x: 3 });
    });

    it("should return undefined if no value is found", async () => {
        const result = await AA([{ x: 1 }, { x: 2 }, { x: 3 }]).find(async ({ x }) => {
            return new Promise(resolve => {
                setTimeout(() => resolve(x === 4), 10);
            });
        });

        expect(result).toBeUndefined();
    });

    it("should return undefined on an empty array", async () => {
        const result = await AA([]).find(() => true);
        expect(result).toBeUndefined();
    });
});
