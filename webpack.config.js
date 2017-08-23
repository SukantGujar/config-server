const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin'),
LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
	devtool: "sourcemap",

	entry: ['babel-polyfill', './client/index.js'],

	"resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
	},
	
	devServer : {
		publicPath : "/ui/",
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
					presets: [
						['es2015', {"modules" : false}], 
						'react', 
						"es2017"
					],
					plugins: [
						["lodash"],
						["transform-class-properties", { "spec": true }],
						["transform-object-rest-spread", { "useBuiltIns": true }]
					]
				}
			}
		]
	},

	plugins: [
		new LodashModuleReplacementPlugin({
			'collections': true,
			'paths': true
		}),
		new CopyWebpackPlugin([
			{
				from : "node_modules/monaco-editor/min/vs",
				to : "vs"
			}
		]),
		new HtmlWebpackPlugin({
			"template" : "./client/assets/index.html"
		})
		//new UglifyJSPlugin()
	]
};
