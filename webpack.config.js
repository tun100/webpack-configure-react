// utils and node.js api
const fs = require('fs')
const sh = require('shelljs')
const _ = require('lodash')
const os = require('os')
const path = require('path')
// webpack import
const webpack = require('webpack')
const compiler = webpack.compiler
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// webpack init
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
// function declare
const utils = {
  getCrtPath: path => {
    return path.join(__dirname, path)
  }
}
function createStyleUseObject (isModule = true) {
  return [
    {
      loader: MiniCssExtractPlugin.loader
    },
		// {
		//   loader: 'style-loader'
		// },
    {
      loader: 'css-loader',
      query: isModule
				? { modules: true, localIdentName: '[name]__[local]___[hash:base64:5]' }
				: { modules: false }
    },
    {
      loader: 'less-loader'
    }
  ]
}
// variables declare
var babelrc = {
  presets: ['react-app', 'es2017'],
  plugins: ['transform-decorators-legacy', 'transform-class-properties']
}
var htmlPlugins = []
var distdir = utils.getCrtPath('dist')

// html basic add index page
var indexHtmlPath = utils.getCrtPath('./index/index.html')
var chunkName = 'index'
var indexPagePlugin = new HtmlWebpackPlugin({
  template: indexHtmlPath,
  filename: indexHtmlPath,
  chunks: [chunkName]
})
htmlPlugins.push(indexPagePlugin)

var webpackConfig = {
  entry: entryobj,
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {}
  },
  plugins: _.filter(
    [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin([distdir], {
        allowExternal: true
      }),
      ...htmlPlugins,
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new HappyPack({
        id: 'happybabel',
        loaders: ['ts-loader', 'babel-loader', 'xml-loader'],
        threadPool: happyThreadPool,
        verbose: true
      })
    ],
		(x, d, n) => {
  return !_.isNil(x)
}
	),
  output: {
    filename: '[name].[contenthash].js',
    publicPath: './',
    path: distdir
  },
  optimization: {},
	// devServer: {
	//     inline: true,
	//     // after() {
	//     //     console.log('after now');
	//     // },
	//     hot: true,
	//     inline: true,
	//     progress: true,
	//     // proxy: proxyobj,
	//     publicPath: '/',
	//     // contentBase: path.join(__dirname, 'dist'),
	//     compress: true,
	//     port: 1234
	// },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelrc
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /antd/,
        use: createStyleUseObject()
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components|link_react)/,
        use: [
          {
            loader: 'babel-loader',
            options: babelrc
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../[name].[ext]'
            }
          }
        ]
      }
    ]
  }
}
module.exprots = webpackConfig
