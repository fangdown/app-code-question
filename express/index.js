// express
var http = require('http')
var express = () => {
  var funcs = []
  var app = (req, res) => {
    var i = 0;
    var next = () => {
      var task = funcs[i++]
      if(!task) return
      task(req, res, next)
    }
    next()
  }
  app.use = (task) => {
    funcs.push(task)
  }
  return app
}
// 中间件
const middleA = (req, res, next) =>{
  if(req.url === '/'){
    res.end('ok')
  }
  next()
}
var app = express()
http.createServer(app).listen(3000, () => {
  console.log('listen on 3000')
})

app.use(middleA)