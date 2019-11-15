const path = require('path')
const fs = require('fs')
const filename = path.resolve(__dirname, 'test.json')

const data = JSON.parse(fs.readFileSync(filename))
console.log('data', data)
