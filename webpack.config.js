module.exports = {
    entry: {
        honeymate: './source/honeymate.js',
        'honeymate-module': ['./source/index.js'],
    },
    output: {
        filename: '[name].js',
    },
    devtool: false,
}
