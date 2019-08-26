/**
 * 轮播图设计
 * 获取到轮播集合 点集合 上一页下一页
 * 获取index
 * 设置index
 * 原理：利用z-index显示需要的层，点则通过active来设定
 */
class Carousel {
  constructor(root){
    this.root = root
    this.panels = Array.from(root.querySelectorAll('.panel'))
    this.dots = Array.from(root.querySelectorAll('.dots span'))
    this.prevBtn = root.querySelector('.prev')
    this.nextBtn = root.querySelector('.next')
    this.dotsEle = root.querySelector('.dots')
    this.init()
  }
  init(){
    this.prevBtn.onclick = e => {
      const index = this.getPrevIndex()
      this.setIndex(index)
    }
    this.nextBtn.onclick = e => {
      const index = this.getNextIndex()
      this.setIndex(index)
    }
    this.dotsEle.onclick = e => {
      if(e.target.tagName !== 'SPAN') return
      const index = this.dots.indexOf(e.target)
      this.setIndex(index)
    }
  }
  setIndex(index){
    this.setDot(index)
    this.setPage(index)
  }
  getIndex(){
    return this.dots.indexOf(this.root.querySelector('.dots .active'))
  }
  getPrevIndex(){
    return (this.getIndex() - 1 + this.dots.length) % this.dots.length
  }
  getNextIndex(){
    return (this.getIndex() + 1) % this.dots.length
  }
  setDot(index){
    this.dots.forEach(dot => dot.classList.remove('active'))
    this.dots[index].classList.add('active')
  }
  setPage(index){
    this.panels.forEach(panel => panel.style.zIndex = 0)
    this.panels[index].style.zIndex = 10
  }
}