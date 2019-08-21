// IIFE示例
;(function(){
  // xxx
  window.module = {}
})()

;(function(){
  let data = 'git123.cn'
  function foo(){
    console.log(`foo-${data}`)
  }
  function bar(){
    console.log(`bar-${data}`)
    otherfun()
  }
  function otherfun(){

  }
  window.module1 = {foo, bar}
})()