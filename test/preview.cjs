'use strict'

const StaticServer = require('static-server')
const { join } = require('path')
const { unlinkSync } = require('fs')
const { execSync } = require('child_process')

const publicPath = 'test/public'

function startServer() {
  return new Promise((resolve) => {
    new StaticServer({
      rootPath: join(__dirname, 'public'),
      port: 3000,
      host: '127.0.0.1'
    }).start(resolve)
  })
}

function symlinkLib (path, name) {
  const outPath = join(publicPath, name)
  try {
    unlinkSync(outPath)
  } catch (e) {
    // Do nothing
  } finally {
    execSync(`ln "${path}" "${outPath}"`, { shell: true })
  }
}

async function main() {
  symlinkLib('lib/index.esm.js', 'honeymate.js')
  await startServer()
}

main()
