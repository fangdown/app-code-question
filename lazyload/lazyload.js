/**
 * 设计思路
 * 获取可视高度
 * 图片默认设置lazy-src，src=loading图
 * 循环所有图片，根据图片是否在可视区域内 clientHeight + scrollTop -offsetTop > 0
 * 更好src真实地址，去掉lazy-src属性，
 * 增加onsroll监听
 */
function lazyload(){
  let clientHeight = document.documentElement.clientHeight
  let imgs = document.querySelectorAll('img')
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  for(let i = 0, len = imgs.length; i < len; i++){
    let img = imgs[i]
    let lazySrc = img.getAttribute('lazy-src')
    if(img.getAttribute('lazy-src') == null) continue
    let imgTop = img.offsetTop
    if(clientHeight + scrollTop - imgTop > 0){
      img.setAttribute('src', lazySrc)
      img.removeAttribute('lazy-src')
    }
  }
}
let interval = null
window.onscroll = function(){
  if(!interval){
    interval = setInterval(checkScrollStop, 500)
  }
  topValue = document.documentElement.scrollTop || document.body.scrollTop;
}
function checkScrollStop(){
  var top = document.documentElement.scrollTop || document.body.scrollTop
  // if(top == topValue){
  //   clearInterval(interval)
  //   interval = null
  //   lazyload()
  // }
  clearInterval(interval)
  interval = null
  lazyload()
}