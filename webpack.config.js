const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const path = require('path');

const basePath = '.';

const absoluteBasePath = path.resolve(path.join(__dirname, basePath));

module.exports = {
    mode: 'development',
    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            ['@babel/plugin-transform-react-jsx', {
                                'importSource': '@bpmn-io/properties-panel/preact',
                                'runtime': 'automatic'
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.less$/i,
                use: [
                    // compiles Less to CSS
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.bpmn$/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    },
    resolve: {
        mainFields: [
            'browser',
            'module',
            'main'
        ],
        alias: {
            'react': '@bpmn-io/properties-panel/preact/compat'
        },
        modules: [
            'node_modules',
            absoluteBasePath
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: 'app/index.html', to: '.'},
                {from: 'resources/Modules.json', to: '.'},
                {from: 'node_modules/bpmn-js/dist/assets/bpmn-js.css', to: 'assets/bpmn-js/.'},
                {from: 'node_modules/bpmn-js/dist/assets/diagram-js.css', to: 'assets/bpmn-js/.'},
                {from: 'node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css', to: 'assets/bpmn-js/.'},
                {from: 'node_modules/@bpmn-io/properties-panel/dist/assets/properties-panel.css', to: 'assets/bpmn-js-properties-panel/.'},
                {from: 'node_modules/bpmn-js-color-picker/colors/color-picker.css', to: 'assets/bpmn-js-color-picker/.'},
                {from: 'node_modules/ace-builds/src-noconflict/worker-xml.js', to: '.'}
            ]
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version),
            BUILD_DATE: JSON.stringify(new Date())
        })
    ]
};
