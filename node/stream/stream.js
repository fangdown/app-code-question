/**
 * 纯粹的流拷贝
 */
// const fs = require('fs')
// const path = require('path')

// const sourceFile = path.resolve(__dirname, './static/source.txt')
// const destFile = path.resolve(__dirname, './static/dest.txt')

// const readStream = fs.createReadStream(sourceFile) // 读流
// const writeStream = fs.createWriteStream(destFile) // 写流

// readStream.pipe(writeStream) // 从一个流到另外一个流
// readStream.on('end', function(err){ // 读流上监听事件
//   console.log('拷贝完成')
// })

/**
 * 浏览器req res 读文件
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer(function(req, res){
  const method = req.method
  if(method === 'GET'){
    const filename = path.resolve(__dirname, './static/source.txt')
    // fs.readFile(filename, function(err, data){
    //   res.end(data)
    // })
    let stream = fs.createReadStream(filename)
    stream.pipe(res)
  }
})
server.listen(8002)
