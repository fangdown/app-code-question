const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.set('view engine', 'ejs')
app.set('views',  './views')

app.get('/', (req, res) => {
  res.render('index.ejs', {
    name: 'ff',
    age: 24,
    gender: '男',
    hobby: ['唱歌', '跳舞', '吃饭'],
    desc: '<h1>这是html代码</h1>'
  })
})
app.listen(16010, () => console.log('Example app listening on port 16010!'))