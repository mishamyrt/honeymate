import { Parcel } from '@parcel/core'
import { execSync } from 'child_process'
import { gzipSize, fileSize } from './size.mjs'

const DIST = './benchmarks/size/dist'
const CSS_PATH = './lib/styles.css'

const basicTargetConfig = {
  context: 'browser',
  distDir: DIST,
  scopeHoist: true,
  optimize: true,
}

process.env.NODE_ENV = 'production'
let bundler = new Parcel({
  entries: './benchmarks/size/main.js',
  config: '@parcel/config-default',
  mode: 'production',
  targets: {
    main: {
      ...basicTargetConfig,
      distEntry: 'main.esm.js',
      outputFormat: 'esmodule',
      engines: {
        "browsers": ["> 0.5%, last 4 versions"]
      }
    },
    legacy: {
      ...basicTargetConfig,
      distEntry: 'main.polyfilled.js',
      outputFormat: 'global',
      engines: {
        "browsers": "> 10%, last 4 versions, not dead, IE 11"
      }
    }
  }
})

function printSize(b) {
  const gSize = gzipSize(`${DIST}/${b.displayName}`)
  return {
    file: b.displayName,
    gzip: gSize,
    raw: b.stats.size / 1024
  }
}

try {
  let { bundleGraph, buildTime } = await bundler.run();
  let bundles = bundleGraph.getBundles();
  const results = bundles.map(printSize)
  results.push({
    file: 'styles.css',
    gzip: gzipSize(CSS_PATH),
    raw: fileSize(CSS_PATH)
  })
  console.table(results)
  const jsSize = results[0].gzip.toFixed(2)
  const cssSize = results[2].gzip.toFixed(2)
  const commonSize = (results[0].gzip + results[2].gzip).toFixed(2)
  console.log(`✨ Modern bundle size: ${jsSize} + ${cssSize} = ${commonSize} Kb`);
} catch (err) {
  console.log(err)
  console.log(err.diagnostics);
}
