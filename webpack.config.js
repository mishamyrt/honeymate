/* eslint-env node */

const webpack = require('webpack')
const packageJson = require('./package.json')

const license =
`/*
* Honeymate ${packageJson.version}
* @homepage ${packageJson.homepage}
* @license ${packageJson.license}
*/`

const plugins = [
    new webpack.BannerPlugin(license),
]

module.exports = {
    entry: {
        honeymate: './source/honeymate.js',
        'honeymate-commonjs': ['./source/index.js'],
    },
    output: {
        filename: '[name].js',
        library: 'honeymate',
        libraryTarget: 'umd',
    },
    devtool: false,
    watch: false,
    plugins,
}
