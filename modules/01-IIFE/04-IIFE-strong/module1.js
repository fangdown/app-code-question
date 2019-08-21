// IIFE示例
;(function($){
  // xxx
  window.module = {}
})()

;(function(window,$){
  let data = 'git123.cn'
  function foo(){
    console.log(`foo-${data}`)
    console.log("$", $)
    $('body').css('color', 'red')
  }
  function bar(){
    console.log(`bar-${data}`)
    otherfun()
  }
  function otherfun(){

  }
  window.module1 = {foo, bar}
})(window, jQuery)