function delegate(parent, eventType, selector, fn){
  if(typeof parent === 'string'){
    var parent = document.getElementById(parent);
    !parent && alert('parent is not a element');
  }
  if(typeof fn !== 'function'){
    alert('fn is not a function');
  }
  parent[eventType] = function handle(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    if(target.id === selector || target.className.indexOf(selector) > -1){
      fn.call(target)
    }
  }
}