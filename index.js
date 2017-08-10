const http = require('http')

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
        console.log(`\ndata:{"name": "${name}", "url": "http://${url}:${port}",`)
        console.log('"data":', streamData.substring(5, endOfStream), "}\n") // removes "data"
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
