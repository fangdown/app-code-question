module.exports = function(req, res,next){
  req.data = '我是中间件加的'
  next()
}