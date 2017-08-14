const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

app.set('view engine', 'ejs')

app.use(session({
  secret: 'rahmathidayatrahmathidayat',
  resave: false,
  saveUninitialized: true,
  cookie: {} //{ secure: true }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

//routing
let index = require('./routes/index')
let teachers = require('./routes/teachers')
let subjects = require('./routes/subjects')
let students = require('./routes/students')

app.use('/', index)
app.use('/teachers', teachers)
app.use('/subjects', subjects)
app.use('/students', students)

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
