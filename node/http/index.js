const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
http.createServer(function(req, res){
  const reqUrl = url.parse(req.url)
  const pathname = reqUrl.pathname
  console.log(reqUrl)
  fs.readFile(path.join(__dirname,'../../static', pathname.substr(1)), function(err, data){
    if(err){
      console.log('err'+err)
      res.writeHead(404, {'Content-type': 'text/html'})
    } else {
      res.writeHead(200, {'Content-type': 'text/html'})
      res.write(data.toString())
    }
    res.end()
  })
}).listen(3000)
// 控制台会输出以下信息
console.log('Server running at http://127.0.0.1:3000/');