const EventEmitter = require('events').EventEmitter
const event = new EventEmitter()
event.on('some_event', function(){
  console.log('a事件触发')
  console.log(...arguments)
})
setTimeout(() => {
  event.emit('some_event', 'p1', 'p2')
}, 1000);