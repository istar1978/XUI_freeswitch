var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var config = {
    entry: {
         "index": ["./src/jsx/index.js","./src/css/xui.css"],
    },
    output: {
        path: '../www/assets',
        filename: 'js/jsx/[name].[chunkhash:8].js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
            exclude: /node_modules/
        }, {
            test: /\.(js|jsx)$/,
            loaders: ['react-hot', 'babel?' + JSON.stringify({
                cacheDirectory: true,
                plugins: [
                    'transform-runtime',
                    'transform-decorators-legacy'
                ],
                presets: ['es2015', 'react', 'stage-0'],
                env: {
                    production: {
                        presets: ['react-optimize']
                    }
                }
            })],
            exclude: /node_modules/
        }]
    },
    performance: {
        hints: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './index.html',
            inject: true,
            chunks: ['index']
        }),
        new WebpackMd5Hash(),
        new ExtractTextPlugin("./css/xui.[chunkhash:8].css"),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false
            },
        }),
    ],
};
module.exports = config;
