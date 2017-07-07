const babel = require('gulp-babel');
const gulp = require('gulp');
const zip = require('gulp-zip');
const pkg = require('./package.json');
const header = require('gulp-header');
const banner = ['/**',
    ' * Averto - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

const release = './release/';
const build = './build/';

gulp.task('build', function() {
    gulp.src('./source/*.js')
        .pipe(babel({ presets: ['babili'] }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(build))
});

gulp.task('zip', function() {
    var version = pkg.version;

    return gulp.src([
            build + 'averto.js',
        ])
        .pipe(zip('mishamyrt-averto-' + version + '.zip'))
        .pipe(gulp.dest(release));
});