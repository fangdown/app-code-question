let lastTime = 0 
window.requestAnimationFrame = function(callback){
  let now = Date.now()
  let nextTime = Math.max(lastTime + 16, now)
  return setTimeout(() => {
    callback(lastTime = nextTime)
  }, nextTime - now); 
}

/**  
 * 

 第一次
lastTime:0
nextTime: now1
lastTime: now1
0

// 第二次
lastTime: now1
nextTime: 
  未超过16ms： now1+16 
  超过16： now2
lastTime: 
  未超过16ms：now1+16 
  超过16ms： now2

如果被阻塞lastTime+16 远远小于now，那么取now然后立即执行
*/