const express = require('express')
let router = express.Router()
const models = require('../models')
const randomSalt = require('../helpers/random-salt')
const crypto = require('crypto')

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Sequelize Intro',
    session: req.session
  })
})

router.get('/login', (req, res, next) => {
  if (req.session.hasOwnProperty('username'))
    res.redirect('/')
  else
    next()
}, (req, res) => {
  res.render('login', {
    title: 'Login',
    err: req.query.err,
    session: req.session
  })
})

router.post('/login', (req, res, next) => {
  if (req.session.hasOwnProperty('username'))
    res.redirect('/')
  else
    next()
}, (req, res) => {
  models.user.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    // console.log(req.session);
    if (user != null) {
      let inputPassword = crypto.createHmac('sha256', user.salt).update(req.body.password).digest('hex')
      if (inputPassword == user.password) {
        req.session.username = user.username
        req.session.role = user.role

        res.redirect('/')
      } else
      res.redirect('/login?err=Password salahh!')
    } else
      res.redirect('/login?err=User not found')
  })
  .catch(err => {
    throw err
  })
})

router.get('/logout', (req, res, next) => {
  if (req.session.hasOwnProperty('username'))
    next()
  else
    res.redirect('/')
}, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    err: req.query.err,
    session: req.session
  })
})

router.post('/signup', (req, res) => {
  if (req.body.password == '' || req.body.repeatPassword == '')
    res.redirect(`/signup?err=Password ga boleh kosong!`)
  else if (req.body.password != req.body.repeatPassword)
    res.redirect(`/signup?err=Password ga sama!`)
  else
    models.user.findOne({where: {username: req.body.username}})
    .then(result => {
      if (result != null)
        res.redirect('/signup?err=Username udah kepake!')
      else {
        let insertUser = () => {
          let insert = {
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            salt: randomSalt(8)
          }

          models.user.create(insert)
          .then(() => {
            res.redirect('/login')
          })
          .catch(err => {
            if(err.message == 'salt must be unique')
              insertUser()
          })
        }

        insertUser()
      }
    })
})

module.exports = router
