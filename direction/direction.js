var startX, startY;
let wrap = document.getElementsByClassName('wrap')[0]
document.addEventListener('touchstart', function(e){
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
}, false);
document.addEventListener('touchend', function(e){
  var endX, endY;
  endX = e.changedTouches[0].pageX;
  endY = e.changedTouches[0].pageY;
  var direction = getSlideDirection(startX, startY, endX, endY);
  switch (direction) {
    case 0: 
      console.log('没动');
      break;
    case 1: 
      console.log('向上')
      wrap.style.backgroundColor = 'blue'
      break;
    case 2: 
      console.log('向下')
      wrap.style.backgroundColor = 'green'
      break;
    case 3: 
      console.log('向左')
      wrap.style.backgroundColor = 'pink'
      break;
    case 4: 
      console.log('向右')
      wrap.style.backgroundColor = 'red'
      break;
    default:
      break;
  }
})
// 计算方向结果
function getSlideDirection (startX, startY, endX, endY){
  var dx = endX - startX;
  var dy = endY - startY;
  var result = 0;
  if(Math.abs(dx) < 2 && Math.abs(dy) < 2){
    return result;
  }
  var angle = getSlideAngle(dx, dy)
  if (angle >= -45 && angle < 45) {
    result = 4
  } else if (angle >= 45 && angle < 135){
    result = 1
  } else if ((angle > 135 && angle <= 180 ) ||  (angle < -135 && angle >= -180 )){
    result = 3
  } else if (angle >= -135 && angle < -45) {
    result = 2;
  }
  return result
}
// 计算角度
function getSlideAngle (dx, dy){
  return Math.atan2(dy, dx)* 180 / Math.PI; // dx,dy 相反
}