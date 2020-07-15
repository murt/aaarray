const path = require("path");

const entry = path.resolve("src", "aaarray.ts");

const output = {
    path: path.resolve("dist"),
    libraryTarget: "umd",
    globalObject: "this",
};

const common = {
    entry,
    devtool: "source-map",
    resolve: {
        extensions: [".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
};

module.exports = [
    {
        ...common,
        mode: "development",
        output: {
            ...output,
            filename: "aaarray.js",
        },
    },
    {
        ...common,
        mode: "production",
        entry,
        output: {
            ...output,
            filename: "aaarray.min.js",
        },
    },
];
