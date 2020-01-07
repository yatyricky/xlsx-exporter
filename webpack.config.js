const path = require("path");

module.exports = {
    entry: "./js/Main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    target: "node"
};
