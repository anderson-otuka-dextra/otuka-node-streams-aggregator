const http = require('http')
const config = require('./config')

let serverResponse
let services = {}

const server = http.createServer((req, res) => {
  serverResponse = res
  serverResponse.writeHead(200, {'Content-Type': 'text/event-stream; charset=utf-8'});
});

const plugStream = (url, port, path, name) => {
  console.log(`[INFO] Attempting to connect to http://${url}:${port}${path}`)
  let streamData = ''
  const req = http.request({
    hostname: url,
    port: port,
    path: path,
    method: 'get'
  }, (res) => {
    res.setEncoding('utf8')
    res.on('data', chunk => {
      streamData += chunk
      if (streamData.indexOf(': ping') > -1) {
        streamData = streamData.replace(/: ping\n/g, '')
      }
      let endOfStream = streamData.indexOf('\n\n')
      while (endOfStream > -1) {
        services[name] = services[name] ? services[name] + 1 : 1
        if (serverResponse) {
          serverResponse.write(`\ndata:{"name": "${name}", "url": "http://${url}:${port}",`)
          serverResponse.write('"data":' + streamData.substring(5, endOfStream) + "}\n")
        }

        streamData = streamData.substring(endOfStream + 2)
        endOfStream = streamData.indexOf('\n\n')
      }
    })
    res.on('end', () => {
      res.end()
    })
  })
  req.on('error', e => {
    console.error(`[ERROR] http://${url}:${port}/${path} [${name}] -`, e.message)
  })
  req.end()
}

setInterval(() => {
  if (Object.keys(services).length) {
    console.log(JSON.stringify(services))
    services = {}
  } else {
    console.log('No services received complete chunks.')
  }
}, 2500)

for (const serviceName in config) {
  const [host, port, path] = config[serviceName]
  plugStream(host, port, '/' + path, serviceName)
}

server.listen(3000)
console.log("\n======\nApplication is running, point your browser to http://localhost:3000 and see the magic.\nHit CTRL+C to stop\n======\n")