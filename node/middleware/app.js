const express = require('express')
const app = express()
const m1 = require('./m1') // 中间件
app.use(m1)
app.get('/', (req, res) => res.send(req.data))
app.listen(16010, () => console.log('Example app listening on port 16010!'))