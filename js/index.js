const express = require('express')
const pug = require('pug')
const routes = require('./routes/routes')
const path = require('path')
const app = express()
const PORT = 8080

app.set('view engine', pug)
app.use('/', routes)
app.use(express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`)
})
module.exports = app