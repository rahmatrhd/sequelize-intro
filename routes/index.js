const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Sequelize Intro',
    session: req.session
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
      username: req.body.username,
      password: req.body.password
    }
  })
  .then(user => {
    // console.log(req.session);
    if (user != null) {
      req.session.username = user.username
      req.session.role = user.role

      res.redirect('/')
    } else {
      res.redirect('/login?err=User not found')
    }
  })
  .catch(err => {
    throw err
  })
})

module.exports = router
