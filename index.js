const http = require('http')

let myRes

const server = http.createServer((req, res) => {
  myRes = res
  myRes.writeHead(200, {'Content-Type': 'text/event-stream; charset=utf-8'});
});

const plugStream = (url, port, name) => {
  let streamData = ''
  const req = http.request({
    hostname: url,
    port: port,
    path: '/hystrix.stream',
    method: 'get'
  }, (res) => {
    res.setEncoding('utf8')
    res.on('data', chunk => {
      streamData += chunk
      let endOfStream = streamData.indexOf('\n\n')
      while (endOfStream > -1) {
        if (myRes) {
          myRes.write(`\ndata:{"name": "${name}", "url": "http://${url}:${port}",`)
          myRes.write('"data":' + streamData.substring(5, endOfStream) + "}\n")
        }

        streamData = streamData.substring(endOfStream + 2)
        endOfStream = streamData.indexOf('\n\n')
      }
    })
    res.on('end', () => {
      console.log('end')
    })
  })
  req.end()
}

plugStream('10.8.6.254', 3000, 'customer')
plugStream('10.8.7.141', 3000, 'services')

// Point your browser to http://localhost:3000 and see the magic
server.listen(3000)
