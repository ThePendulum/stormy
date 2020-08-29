import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
    entry: './assets/js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public/js'),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                include: [
                    path.resolve(__dirname, 'assets'),
                ],
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false,
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            plugins: [
                                '@babel/plugin-proposal-object-rest-spread',
                            ],
                        },
                    },
                    'eslint-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap',
                ],
            },
            {
                test: /\.svg/,
                use: 'raw-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/style.css',
        }),
    ],
};
