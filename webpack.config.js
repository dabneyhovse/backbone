/**
 * Author:	Nick Jasinski
 * Date:		2022-08-19
 *
 * Basic webpack cconfig file that tells
 * webpack how to compile all of the client files
 * together
 *
 * this setup copies over images with their
 * og names instead of hashes
 *
 * also copies over the index.html template from the resources folder
 */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

let isDev = process.env.NODE_ENV === "development";
isDev = true;
const path = require("path");

module.exports = {
  cache: false,
  stats: {
    assets: false,
    builtAt: true,
    moduleAssets: false,
    modules: false,
    performance: false,
    // warnings: false,
  },
  devtool: "source-map",
  mode: isDev ? "development" : "production",
  entry: ["./src/client/index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "./[name].js",
    chunkFilename: './[name].bundle.js',
    assetModuleFilename: "[path][name].[ext]",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts"],
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      redux: path.resolve(__dirname, "node_modules/redux"),
      "react-redux": path.resolve(__dirname, "node_modules/react-redux"),
      "react-router-dom": path.resolve(
        __dirname,
        "node_modules/react-router-dom"
      ),
      "react-toastify": path.resolve(__dirname, "node_modules/react-toastify"),
      "react-bootstrap": path.resolve(
        __dirname,
        "node_modules/react-bootstrap"
      ),
    },
  },
  watchOptions: {
    // ignored: /node_modules/,
    aggregateTimeout: 600,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: {
          and: [/node_modules/], // Exclude libraries in node_modules ...
          not: [
            // Except for the local services 
            /service-example/,
            /service-frotator/,
          ]
        },
        // include: "/node_modules/service-example/",
        use: {
          loader: "babel-loader",
          options: {
            // presets: ["@babel/preset-env"],
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    // new webpack.SourceMapDevToolPlugin({
    //   filename: "[file].map",
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./resources/index.html",
          to: "index.html",
        },
        {
          from: "./resources/images",
          to: "resources/images",
        },
      ],
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },

  // optimization: {
  //   minimize: false,
  // },
};
