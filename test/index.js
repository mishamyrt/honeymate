/* eslint-env node */
/* eslint no-console: 0 */

const staticServer = require('node-static')
const http = require('http')

const handler = new staticServer.Server('test/')
const PORT = 1337

http.createServer((request, response) => {
    if (request.url === '/honeymate') {
        handler.serveFile('../build/honeymate.js', 200, {}, request, response)
    } else {
        handler.serve(request, response)
    }
}).listen(PORT)

console.log('Server is listening on 127.0.0.1:' + PORT)
