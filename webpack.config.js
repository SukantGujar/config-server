const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: "sourcemap",

	entry: './client/index.js',

	devServer : {
		publicPath : "/ui/",
		//contentBase : __dirname +  "/ui/",
		historyApiFallback: {
			index: '/ui/'
		}
	},

	output: {
		publicPath:"/ui/",
		filename: '[name].bundle.js',
		path: __dirname + '/ui'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
					presets: ['es2015', 'react'],
					plugins: [
						["transform-class-properties", { "spec": true }]
					]
				}
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			"template" : "./client/assets/index.html"
		})
		//new UglifyJSPlugin()
	]
};
