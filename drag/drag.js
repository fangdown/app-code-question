class Drag {
  constructor (ele) {
    this.ele = ele
    this.init()
  }
  init(){
    this.mouseDown()
  }
  mouseDown(){
    this.ele.onmousedown = e => {
      e = e || window.event
      let left = e.clientX - this.ele.offsetLeft
      let top = e.clientY - this.ele.offsetTop
      document.onmousemove = (e) => {
        let moveEvent = e || window.event
        console.log(moveEvent.clientX - left + 'px')
        this.ele.style.left = moveEvent.clientX - left + 'px'
        this.ele.style.top = moveEvent.clientY - top + 'px'
      }
      document.onmouseup = e =>{
        document.onmousemove = null
        document.onmousedown = null
      }
    }
  }
}