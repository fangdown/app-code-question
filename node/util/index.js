const util = require('util')
function Parent(){
  this.name = 'parent'
  this.sex = 'man'
  this.sayHello = function(){
    console.log(`hello,${this.name}`)
  }
}
Parent.prototype.showSex = function(){
  console.log(`sex:${this.name}`)
}

function Child(){
  this.name = 'child'
}
util.inherits(Child, Parent)
const c1 = new Child()
console.log(c1.showSex()) // 只继承了原型链上的方法，没有继承父级的属性
const arr = [1, 2]
console.log(util.isArray(arr))
console.log('require', require)

