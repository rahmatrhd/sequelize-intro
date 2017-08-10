const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  models.teacher.findAll()
  .then(teachers => {
    let promises = teachers.map(teacher => {
      return new Promise((resolve, reject) => {
        teacher.getSubject()
        .then(subjects => {
          if (teacher.subjectId != null)
            teacher.subjects = subjects
          else
            teacher.subjects = []
          return resolve(teacher)
        })
      })
    })

    Promise.all(promises)
    .then(teachers => {
      console.log(teachers);
      res.render('teachers', {data: teachers})
    })
  })
})

router.get('/edit/:id', (req,res) => {
  
})

module.exports = router
