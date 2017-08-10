const http = require('http')

let myRes

const server = http.createServer((req, res) => {
  myRes = res
  myRes.writeHead(200, {'Content-Type': 'text/event-stream; charset=utf-8'});
});

const plugStream = (url, port, path, name) => {
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
        if (myRes) {
          myRes.write(`\ndata:{"name": "${name}", "url": "http://${url}:${port}",`)
          myRes.write('"data":' + streamData.substring(5, endOfStream) + "}\n")
        }

        streamData = streamData.substring(endOfStream + 2)
        endOfStream = streamData.indexOf('\n\n')
      }
    })
    res.on('end', () => {
      res.end()
    })
  })
  req.end()
}

plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=realtimeconsumption', 'realtimeconsumption')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=attendancerecord', 'attendancerecord')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=featureflag', 'featureflag')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=services', 'services')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=bonus', 'bonus')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=plan', 'plan')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=customer', 'customer')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=authentication', 'authentication')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=sms', 'sms')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=billing', 'billing')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=payment', 'payment')
plugStream('10.8.5.54', 8080, '/turbine.stream?cluster=mail', 'mail')

// Point your browser to http://localhost:3000 and see the magic
server.listen(3000)
