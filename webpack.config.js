const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js",
    // clean:true
  },
  module: {
    rules: [
    //   {
    //     test: /\.js$/i,
    //     include: path.resolve(__dirname, "src"),
    //     use: {
    //       loader: "babel-loader",
    //       options: {
    //         presets: ["@babel/preset-env"],
    //       },
    //     },
    //   },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  devServer: {
    static: "public",
    // watchFiles: true,
  },
};
