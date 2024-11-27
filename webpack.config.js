const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js', // Точка входа
    output: {
        filename: 'bundle.js', // Имя выходного файла JavaScript
        path: path.resolve(__dirname, 'dist'), // Папка для сборки
        clean: true, // Очистка папки dist перед сборкой
        publicPath: '/pipedrive_app/', // Базовый путь для деплоя на GitHub Pages
    },
    mode: 'development', // Режим разработки
    devServer: {
        static: './dist', // Папка для сервера разработки
        open: true, // Открытие браузера после старта сервера
        hot: true, // Горячая перезагрузка
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Обработка CSS-файлов
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/, // Обработка изображений
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // Обработка шрифтов
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Шаблон для главной страницы
            filename: 'index.html', // Имя выходного файла
        }),
        new HtmlWebpackPlugin({
            template: './src/callback.html', // Шаблон для callback страницы
            filename: 'callback.html', // Имя выходного файла
        }),
    ],
};
