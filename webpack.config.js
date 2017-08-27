const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin'),
LodashModuleReplacementPlugin = require('lodash-webpack-plugin'),
CSSLoader = [
  'css-loader?sourceMap&-minimize',
  'modules',
  'importLoaders=1',
  'localIdentName=[name]__[local]__[hash:base64:5]'
].join('&');

module.exports = {
	devtool: "sourcemap",

	entry: ['babel-polyfill', './client/index.js'],

	/*
	"resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
	},
*/	
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
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', CSSLoader]
			}, 
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			}, 
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
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
