const babel = require('gulp-babel')
const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const zip = require('gulp-zip')
const pkg = require('./package.json')
const uglify = require('gulp-uglify-es').default
const header = require('gulp-header')
const eslint = require('gulp-eslint')
const http = require('http')
const staticServer = require('node-static')
const handler = new staticServer.Server('test/')
const port = 8080

const banner = ['/**',
    ' * Honeymate - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n')
const release = './release/'
const build = './build/'

gulp.task('lint', () => {
    return gulp.src(['./source/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

gulp.task('default', () => {
    gulp.start('build')
})

gulp.task('server', () => {
    http.createServer((request, response) => {
        if (request.url === '/honeymate') {
            handler.serveFile('../release/honeymate.js', 200, {}, request, response)
        } else {
            handler.serve(request, response)
        }
    }).listen(port)
})

gulp.task('watch', () => {
    gulp.watch('./source/*.js', function () {
        gulp.start(['lint', 'build'])
    })
})

gulp.task('dev', () => {
    gulp.start(['lint', 'build', 'server', 'watch'])
    gulp.src('./source/honeymate.js')
        .pipe(webpackStream(require('./webpack.config.js'), webpack))
        .pipe(gulp.dest(release))
})

gulp.task('build', () => {
    gulp.src('./source/honeymate.js')
        .pipe(webpackStream(require('./webpack.config.js'), webpack))
        .pipe(babel({ presets: ['es2017', 'es2016'] }))
        .pipe(uglify({
            compress: true,
            output: {
                ast: true,
            },
            mangle: {
                toplevel: true,
            }
        }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(release))
})

gulp.task('zip', () => {
    var version = pkg.version
    return gulp.src([
        build + 'honeymate.js',
    ])
        .pipe(zip('mishamyrt-honeymate-' + version + '.zip'))
        .pipe(gulp.dest(release))
})
