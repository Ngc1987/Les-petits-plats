var path = require('path');

module.exports = {
  //...
  entry: "./recipes.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "final.js"
  },
  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    port: 9000,
  },
};