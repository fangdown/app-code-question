// 实现promise.race功能
function promise_race(promises){
  if(!Array.isArray(promises)){
    throw new TypeError('params must be array')
  }
  return new Promise(resolve =>{
    for(let i = 0; i < promises.length; i++){
      Promise.resolve(promises[i]).then(data => {
        console.log('i', i)
        resolve(data)
      })
    }
  })
}
let p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve(1000)
  }, 1000);
})
let p2 = new Promise(resolve =>{
  setTimeout(() => {
    resolve(2000)
  }, 2000);
})
let result = promise_race([p1, p2])
console.log('result', result)

// let result2 = Promise.race([p1,p2])
// console.log('result2', result2)
result.then(data => console.log('data', data))