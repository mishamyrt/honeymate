const Bundler = require('parcel-bundler');
const fs = require('fs');
const uglify = require("uglify-es");

const pkg = require('./package.json')

const license =
`/*
* Honeymate ${pkg.version}
* @homepage ${pkg.homepage}
* @license ${pkg.license}
*/`

const paths = {
    build: 'build/',
    source: 'source/'
}

const build = () => {
    const bundler = new Bundler(paths.source + 'honeymate.js', {
        outDir: 'build',
        watch: false,
        minify: false,
        logLevel: 3,
        sourceMaps: false
    })
    bundler.on('buildEnd', () => {
        const code = uglify.minify(fs.readFileSync('build/honeymate.js', 'utf8'), {
            output: {
                beautify: false,
                preamble: license
            },
            toplevel: true,
            compress: {
                unsafe_proto: true,
                drop_console: true
            }
        }).code
        fs.writeFileSync(paths.build + 'honeymate.js', code)
        console.log(fs.statSync(paths.build + 'honeymate.js').size + ' bytes minifyed')
    })
    bundler.bundle()
}

if (process.argv.length < 2) {
    console.log('too few arguments')
} else {
    switch (process.argv[2]) {
        case 'build': 
            build()
        break;
    }
}