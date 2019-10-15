/**
 * 
 * @param {*} msg 
验证执行顺序
function cb(msg){
  return function() {
      console.log(msg);
  }
}

setTimeout(cb('setTimeout'), 1000);
setImmediate(cb('setImmediate'))
process.nextTick(cb('process.nextTick'));
cb('Main process')();
// 输出顺序
// Main process
// process.nextTick
// setImmediate
// setTimeout
 */


/**
 * 验证阻塞io
 * 

function test() {
  return process.nextTick(() => test());
}

test(); // 进入死循环了

setImmediate(() => {
  console.log('setImmediate');
})
// 不会有输出
*/

function test() {
  return setTimeout(() => {
    () => test()
  }, 0);
}

test(); 

setImmediate(() => {
  console.log('setImmediate');
})