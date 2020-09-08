import AA from "../src";

describe("aaarray#find", () => {
    it("should find a value asynchronously", async () => {
        const result = await AA([{v: 1}, {v: 2}, {v: 3}]).find(async ({v}) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(v === 3), 10);
            })
        });

        expect(result).toEqual({v:3});
    });

    it("should find a value synchronously", async () => {
        const result = await AA([{v: 1}, {v: 2}, {v: 3}]).find(({v}) => {
            return v === 3;
        });

        expect(result).toEqual({v:3});
    });

    it("should return undefined if no value is found", async () => {
        const result = await AA([{v: 1}, {v: 2}, {v: 3}]).find(async ({v}) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(v === 4), 10);
            })
        });

        expect(result).toBeUndefined();
    });
});
