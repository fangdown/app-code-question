// 手写精简版promise.all
function promise_all(promises){
  if(!Array.isArray(promises)){
    throw new TypeError('params must be array')
  }
  return new Promise((resolve, reject) => {
    let len = promises.length
    let counter = 0
    let resArr = new Array(len)
    for(let i = 0; i< len; i++){
      Promise.resolve(promises[i]).then(value =>{
        counter++
        resArr[i] = value
        if(counter === resArr.length){
          resolve(resArr)
        }
      }, error => {
        reject(error)
      })
    }
  })
}