const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js', 
    output: {
        filename: 'bundle.js', 
        path: path.resolve(__dirname, 'dist'), 
        clean: true, 
    },
    mode: 'development', 
    devtool: 'inline-source-map', 
    devServer: {
        static: './dist', 
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i, 
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Главная страница
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/callback.html', to: 'callback.html' }, // Копируем callback.html
            ],
        }),
    ],
};
