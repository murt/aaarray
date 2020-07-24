import AA, { AAArray } from "../src";

/**
 * @important
 * These tests are designed to probe the runtime type checking of AAArray. As such
 * they will be repetitive and in many ways non-sensical. Typescript will complain
 * about all of them so there are many @ts-expect-error comments. Many many many
 * such comments.
 */

describe("aaarray?args", () => {
    describe("constructor", () => {
        it("should allow no arguments which defaults to an empty array", async () => {
            // @ts-expect-error
            expect(() => AA()).not.toThrow();
            // @ts-expect-error
            expect(await AA().length()).toBe(0);
        });

        it("should not allow a non-array value", () => {
            // @ts-expect-error
            expect(() => AA(123)).toThrowError(TypeError);
        });

        it("should not allow strings although they are technically character arrays", () => {
            // @ts-expect-error
            expect(() => AA("123")).toThrowError(TypeError);
        });
    });

    describe("callbacks are functions", () => {
        ([
            "each",
            "eachSerial",
            "every",
            "everySerial",
            "filter",
            "filterSerial",
            "find",
            "findIndex",
            "findIndexSerial",
            "findSerial",
            "flatMap",
            "forEach",
            "forEachSerial",
            "map",
            "mapSerial",
            "reduce",
            "reduceRight",
            "some",
            "someSerial",
        ] as (keyof AAArray<any>)[]).forEach(method => {
            it(method, () => {
                // @ts-expect-error
                expect(() => AA([1, 2, 3])[method]()).toThrowError(TypeError);
            });
        });
    });
});
