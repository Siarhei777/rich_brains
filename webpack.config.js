const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    devServer: {
        port: 3000,
        open: true,
        hot: true,
    },
    entry: ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            /* template: path.resolve(__dirname, 'src', 'index.html') */
            template: path.resolve(__dirname, 'src', 'index.pug'),
            filename: "index.html",
            favicon: path.resolve(__dirname, 'src/favicone', 'favicon.ico')            
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    module: {
        rules: [
            {
                test: /.\html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            },
                        },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(woff|woff2|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.pug$/,
                include: path.resolve(__dirname),
                use: [                    
                    {
                        loader: "simple-pug-loader",                        
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                use: [
                    {                        
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                              progressive: true,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                              enabled: false,
                            },
                            pngquant: {
                              quality: [0.65, 0.90],
                              speed: 4
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                              quality: 75
                            }
                        }
                    },
                    
                ],
                type: 'asset/resource',                
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                    },
                },
            },            
        ],
    },
}