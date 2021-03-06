
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


const config = {
    entry: {
        //multiple entry point instead of './src/index.js'
        bundle: [ 
           //'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
            //'webpack-hot-middleware/client?http://localhost:9999',
            'babel-polyfill', './src/index.js'
            ]
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
              },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 60000 }
                    },
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        //for optimising css contents
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {
                removeAll: true
            } },
            canPrint: true
        }),
        //Used to seperate all css files into style.css file
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //react used NODE_ENV on window scope
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') }
        }),
        //for minification for Javascript files
        new MinifyPlugin(),
        new CompressionPlugin({
            algorithm: 'gzip'
        })
    ]
};

module.exports = config;
