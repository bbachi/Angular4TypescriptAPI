var path =  require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

const sourcePath = path.join(__dirname, './app');
const buildPath = path.join(__dirname, './dist');
const environment = (process.env.NODE_ENV === "production");
var dotEnvPath = './environment/dev/.env';
console.log("ENV:::"+process.env.NODE_ENV);
if(environment){
  dotEnvPath = './environment/prod/.env';
  console.log('webpack is building for production:::'+dotEnvPath);
}else{
   console.log('webpack is building for development:::'+dotEnvPath);
}

module.exports = {
  entry: ["./index.ts"],
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname,"dist"),
    publicPath : path.resolve(__dirname,"dist")
  },
  target:"node",
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader',exclude: ["node_modules","GMESSAPP"]},
      { test: /\.json/, loader: "json-loader", exclude:/node_modules/,},
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js",".json"]
  },
  plugins: [
    new Dotenv({
      path: dotEnvPath, // Path to .env file (this is the default)
      safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
    })
  ]

}
