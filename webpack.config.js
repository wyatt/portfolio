module.exports = {
  entry: "./src/js/main.js",
  mode: "production",
  output: {
    path: `${__dirname}/dist`,
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg|gif|png|eot|woff|ttf|jpg)$/,
        use: ["url-loader"],
      },
    ],
  },
};
