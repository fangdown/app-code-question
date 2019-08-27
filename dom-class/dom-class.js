const domClass = {
  addClass: function (ele, cls) {
    let className = ele.className
    className += ' ' + cls
    ele.className = className
  },
  removeClass: function (ele, cls) {
    let className = ele.className
    className = className.replace(/\s+/g, ' ')
    className = className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), '')
    className = className.replace(/\s+^|\s$/, '')
    ele.className = className
  },
  hasClass: function (ele, cls) {
    let className = ele.className
    className = className.replace(/\s+/g, '')
    return new RegExp(' ' + cls + '').test(' ' + className + ' ')
  }
}