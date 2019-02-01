const Bundler = require('parcel-bundler');
const bs = require('browser-sync').create();
const minify = require('html-minifier').minify;
const fs = require('fs');

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve(file);
        });
    });
};

const paths = {
    source: './source/',
    modules: './source/modules/',
    assets: './assets/'
}

const parentFolder = /\.\.\//

const options = {
    outDir: paths.assets,
    publicUrl: './',
    watch: false,
    cache: true,
    minify: true,
    logLevel: 3,
};

const jsBuild = () => {
    const bundler = new Bundler(
        `${paths.modules}app.js`,
        options,
    );
    return bundler.bundle()
}

const cssBuild = () => {
    const bundler = new Bundler(
        `${paths.modules}styles.css`,
        options,
    );
    return bundler.bundle()
}

const htmlBuild = () => {
    return readFile(`${paths.source}index.html`)
        .then(html => minify(html, {
            collapseWhitespace: true,
            removeComments: true,
        }))
        .then(html => html.replace(new RegExp(parentFolder, 'g'), ''))
        .then(html => writeFile('index.html', html))
}

bs.watch(`${paths.modules}**/*.css`).on(
    'change', () => cssBuild().then(bs.reload)
)
bs.watch(`${paths.modules}**/*.js`).on(
    'change', () => jsBuild().then(bs.reload)
)
bs.watch(`${paths.source}index.html`).on(
    'change', () => htmlBuild().then(bs.reload)
)



// Promises prevents flow race
htmlBuild()
    .then(() => jsBuild())
    .then(() => cssBuild())
    .then(() => {
        process.argv.forEach((argument) => {
            if (argument === '--once') {
                process.exit()
            }
        })
        bs.init({ server: '.' })
    })