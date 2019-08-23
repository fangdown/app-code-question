const http = require('http');
const querystring = require('querystring');
 
const postHTML = 
  '<html><head><meta charset="utf-8"><title>Node.js 实例</title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';
http.createServer(function(req, res){
  let body = ''
  req.on('data', function(thunk){
    body += thunk
  })
  req.on('end', function(){
    body = querystring.parse(body)
    console.log(body)
    res.writeHead(200, {'Content-type': 'text/html;charset=utf8'})
    if(body.name &&body.url){
      res.write('网址名:'+ body.name)
      res.write('<br/>')
      res.write('url:'+body.url)
    } else {
      res.write(postHTML)
    }
    res.end()
  })
}).listen(3000)

console.log('Server running at http://127.0.0.1:3000/');