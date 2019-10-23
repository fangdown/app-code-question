const http = require('http')
const Emitter = require('events')
const compose = require('koa-compose')

module.exports = class Application extends Emitter{
  constructor(){
    super()
    this.middleware = []
    this.context = {}
    this.request = {}
    this.response = {}
  }
  // 保存中间件
  use(fn){
    this.middleware.push(fn)
    return this
  }
  // 加载中间件
  // 启动端口
  listen(...args){
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }
  // 加载中间件+创建上下文
  callback(){
    const fn = compose(this.middleware)
    this.on('error', this.onerror)
    // req, res 来自http
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return this.handleRequest(ctx, fn)
    }
  }
  // 处理请求，返回给客户
  handleRequest(ctx, fnMiddleware){
    const res = ctx.res
    const handleResponse = () => {
      res.end(res.body)
    }
    return fnMiddleware(ctx).then(handleResponse).catch(this.onerror)
  }
  // 创建上下文
  createContext(req, res){
    const context = Object.create(this.context)
    context.request = Object.create(this.request)
    context.response = Object.create(this.response)
    context.req = req
    context.res = res
    context.app = this
    context.state = {}
    return context
  }
  onerror(error){
    console.log(`error occurs ${error.message}`)
  }
}