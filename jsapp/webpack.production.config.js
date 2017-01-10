var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = {
    entry: ["./src/jsx/index.jsx","./src/css/xui.css"],
    output: {
        path: '../www/assets',
        filename: 'js/jsx/index.js'
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
        new ExtractTextPlugin("css/xui.css"),
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
