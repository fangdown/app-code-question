// 定义+ 方法+ 监听+后退
class Routers {
  constructor(){
    this.routes = {};
    this.currentUrl = '';
    // 记录出现过的hash
    this.history = [];
    this.currentIndex = this.history.length -1;
    this.refresh = this.refresh.bind(this);
    this.backOff = this.backOff.bind(this);
    window.addEventListener('load', this.refresh);
    window.addEventListener('hashchange', this.refresh);
  }
  // 设置路由键值对
  pushRoute(path, callback){
    this.routes[path] = callback || function(){}
  }
  // 执行当前路由对应的callback
  refresh() {
    this.currentUrl = location.hash.slice(1) || '/';
    if (!this.isBack) {
      // 如果不是后退操作,且当前指针小于数组总长度,直接截取指针之前的部分储存下来
      // 此操作来避免当点击后退按钮之后,再进行正常跳转,指针会停留在原地,而数组添加新hash路由
      // 避免再次造成指针的不匹配,我们直接截取指针之前的数组
      // 此操作同时与浏览器自带后退功能的行为保持一致
      if (this.currentIndex < this.history.length - 1){
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      this.history.push(this.currentUrl);
      this.currentIndex++;
      }
    this.routes[this.currentUrl]();
    console.log('指针:', this.currentIndex, 'history:', this.history);
    this.isBack = false;
  }
  backOff() {
    this.isBack = true;
    this.currentIndex < 0 
    ? this.currentIndex = 0
    : this.currentIndex =  this.currentIndex -1;
    location.hash = this.history[this.currentIndex];
    this.routes[this.history[this.currentIndex]]();
  }
}