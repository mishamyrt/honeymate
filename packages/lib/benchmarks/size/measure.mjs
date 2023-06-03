import { Parcel } from '@parcel/core'
import { execSync } from 'child_process'

const DIST = './benchmarks/size/dist'

const basicTargetConfig = {
  context: 'browser',
  distDir: DIST,
  scopeHoist: true,
  optimize: true,
}

process.env.NODE_ENV = 'production'
let bundler = new Parcel({
  entries: './benchmarks/size/main.mjs',
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

function gzipSize(file) {
  return parseInt(
    execSync(`gzip -c '${file}' | wc -c`, { shell: true })
      .toString()
      .trim(),
    10
  )
}

function printSize(b) {
  const gSize = gzipSize(`${DIST}/${b.displayName}`) / 1024
  const size = b.stats.size / 1024
  return {
    file: b.displayName,
    ['GZip size']: gSize,
    size
  }
}

try {
  let { bundleGraph, buildTime } = await bundler.run();
  let bundles = bundleGraph.getBundles();
  console.table(bundles.map(printSize))
  // bundles.forEach(b => {
  //   const size = printSize(b)
  //   console.log(`${b.displayName} - ${b.stats.size / 1024} Kb`)
  // })
  console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
} catch (err) {
  console.log(err)
  console.log(err.diagnostics);
}
