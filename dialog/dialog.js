(function(){
  /**
   * 方案
   * IIFE模块化
   * 传入title,content,confirmCb,cancel等参数
   * 生成html，并添加到body内显示
   * 点击操作按钮，回调事件处理
   */
  const dialog = {
    ele: '',
    confirmBtn: '',
    cancelBtn: '',
    /**
     * @method show 显示dialog组件
     * @param {Object} options 一系列参数
     * @returns {Object} 当前dialog节点 
     */
    show: function(options){
      let {title, content, confirmCb =null, cancelCb =null,btns=['确定'],shadeClose=true} = options
      let btnsTemp = ''
      btns.forEach((item, index) => {
        if(index == 2) return
        let btnClass = index === 0 ? 'confirm-btn' : 'cancel-btn'
        let temp = `<div class="btn ${btnClass}">${item}</div>`
        btnsTemp +=temp
      })
      let html = `
        <div class='dialog-wrapper fadeIn'>
          <div class="dialog">
            <div class="title">${title}</div>
            <div class="content">${content}</div>
            <div class="buttons">${btnsTemp}</div>
          </div>
      `
      let div = document.createElement('div')
      div.innerHTML = html 
      document.body.appendChild(div)
  
      this.ele = document.querySelector('.dialog-wrapper');
      this.confirmBtn = this.ele.querySelector('.confirm-btn') 
      this.cancelBtn = this.ele.querySelector('.cancel-btn') 
       // 绑定事件 
      this.bindEvent(confirmCb, cancelCb, shadeClose);
    },
    bindEvent: function(confirmCb, cancelCb, shadeClose){
      const that = this
      this.confirmBtn  &&  this.confirmBtn.addEventListener('click', function(e){
        that.hide()
        confirmCb&&confirmCb()
      })
      this.cancelBtn && this.cancelBtn.addEventListener('click', function(e){
        that.hide()
        cancelCb&&cancelCb()
      })
      // 是否开启点击遮罩关闭
      if (shadeClose) {
        this.ele.addEventListener('click', e => {
          let target = e.target || e.srcElement;
          if (/dialog-wrapper/.test(target.className)) {
            this.hide();
          }
        })
      }
    },
    hide: function(){
      this.ele.classList.add('fadeOut')
      setTimeout(() => {
        this.ele.remove()
      }, 200);  
    }
  }
  window.dialog = dialog
})()