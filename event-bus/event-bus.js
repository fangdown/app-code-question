class EventEmitter{
  constructor(){
    this.events = this.events || new Map()
  }
}
EventEmitter.prototype.emit = function(type, ...args){
  let handler = this.events.get(type);
  if(Array.isArray(handler)){
    for(let i = 0; i < handler.length; i++){
      if(args.length > 0){
        handler[i].apply(this, args)
      } else{
        handler[i].call(this)
      }
    }
  } else {
    if(args.length > 0){
      handler.apply(this, args)
    } else {
      handler.call(this)
    }
  }
  return true
}
EventEmitter.prototype.on = function(type, fn){
  const handler = this.events.get(type)
  if(!handler){
    this.events.set(type, fn)
  } else if(handler && typeof handler === 'function'){
    this.events.set(type, [handler, fn])
  } else {
    handler.push(fn)
  }
}
