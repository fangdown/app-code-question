"use strict"
let module1 = require('./module/module1')
let module2 = require('./module/module2')
let module3 = require('./module/module3')

let fs = require('fs')

module1.foo()
module2()
module3.foo()

fs.readFile('app.js', function(error, data){
  console.log(`data-${data.toString()}}`)
})

// module.exports = exports
// exports 都有s