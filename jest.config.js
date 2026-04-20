export default {
    testEnvironment: "node",
    testMatch: ["<rootDir>/test/*.test.ts"],
    preset: "ts-jest",
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
    testPathIgnorePatterns: ["/node_modules/"],
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    coverageReporters: ["text", "lcovonly"],
    verbose: true,
};
