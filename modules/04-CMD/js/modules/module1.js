

define(function(require, exports, module){
  let data = 'fangdown.cn'
  function show(){
    console.log(`module1 show -${data}`)
  }
  exports.show = show
})