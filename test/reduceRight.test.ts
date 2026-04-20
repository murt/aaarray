import AA from "../src";

describe("aaarray#reduceRight", () => {
    it("should correctly reduce from right with initial value", async () => {
        const result = await AA([1, 2, 3]).reduceRight((acc, n) => acc + n, 0);
        expect(result).toEqual(6);
    });

    it("should correctly reduce from right without initial value", async () => {
        const result = await AA([1, 2, 3]).reduceRight((acc: any, n) => acc + n);
        expect(result).toEqual(6);
    });

    it("should support async callbacks", async () => {
        const result = await AA([1, 2, 3]).reduceRight(
            async (acc, n) =>
                new Promise(resolve => {
                    setTimeout(() => resolve(acc + n), 50);
                }),
            0
        );

        expect(result).toEqual(6);
    });

    it("should work with string concatenation", async () => {
        const result = await AA(["a", "b", "c"]).reduceRight((acc, n) => acc + n, "");
        expect(result).toEqual("cba");
    });

    it("should pass correct index to callback", async () => {
        const indices: number[] = [];
        await AA([10, 20, 30]).reduceRight((acc, n, i) => {
            indices.push(i);
            return acc + n;
        }, 0);

        expect(indices).toEqual([2, 1, 0]);
    });

    it("should throw error on empty array without initial value", async () => {
        await expect(AA([]).reduceRight((acc: number, n: number) => acc + n)).rejects.toThrow(
            "Reduce of empty array with no initial value"
        );
    });

    it("should handle single element array with initial value", async () => {
        const result = await AA([5]).reduceRight((acc, n) => acc + n, 10);
        expect(result).toEqual(15);
    });

    it("should handle single element array without initial value", async () => {
        const result = await AA([5]).reduceRight((acc: number, n) => acc + n);
        expect(result).toEqual(5);
    });
});
