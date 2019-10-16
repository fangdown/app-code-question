// async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里
function spawn(genF){
  return new Promise(function(resolve, reject){
    const gen = genF()
    function step(nextF){
      let next 
      try {
        next = nextF
      } catch(e){
        return reject(e)
      }
      if(next.done){
        return resolve(next.done)
      }
      Promise.resolve(next.value).then(
        function(v) {
          step(function(){
            return gen.next(v)
          })
        },
        function(e){
          step(function(){
            return gen.throw(e)
          })
        }
      )
    }
    step(function(){
      return gen.next(undefined)
    })
  })
}