const foo = function () {
  console.log('hello, fangdown')
}
console.log('初始值')
console.log('exports',exports)
console.log('module.exports', module.exports)

// exports.foo = foo
// console.log('exports添加属性')
// console.log('exports',exports)
// console.log('module.exports', module.exports)

// console.log('module.exports赋值')
// module.exports = {foo}
// console.log('exports',exports)
// console.log('module.exports', module.exports)

console.log('exports赋值')
exports = {foo}
console.log('exports',exports)
console.log('module.exports', module.exports)