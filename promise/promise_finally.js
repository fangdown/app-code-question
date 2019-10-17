// finally实现
function Myfinally(onFinally){
  let isFunction = typeof onFinally ==='function'
  // 在then方法里不管成功还是失败，都执行onFinally方法
  return this.then(isFunction ?  
    result =>{
      isFunction()
      return result
    } :
    onFinally,
    isFunction ? err => {
      onFinally()
      return Promise.reject(err)
    }: onFinally
  )
}
let p1 = new Promise(resolve => {
  setTimeout(() => {
    resolve('hello')
  }, 0);
})
Myfinally.call(p1, setTimeout(() => {
  console.log('finally')
}, 0))

// 输出finally