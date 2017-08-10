const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  models.teacher.findAll()
  .then(rows => {
    res.render('teachers', {data: rows})
  })
})

module.exports = router
