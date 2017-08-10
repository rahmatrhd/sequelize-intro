const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  models.subject.findAll()
  .then(rows => {
    res.render('subjects', {data: rows})
  })
})

module.exports = router
