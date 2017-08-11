const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  models.subject.findAll()
  .then(subjects => {
    let promises = subjects.map(subject => {
      return new Promise((resolve, reject) => {
        // console.log(subject);
        subject.getTeachers()
        .then(teachers => {
          // console.log(teachers);
          subject.teachers = teachers

          resolve(subject)
        })
        .catch(err => {
          reject(err)
        })
      })
    })

    Promise.all(promises)
    .then(subjects => {
      // console.log(subjects);
      res.render('subjects', {data: subjects})
    })
    .catch(err => {
      throw err
    })

  })
  .catch(err => {
    throw err
  })
})

router.get('/:id/enrolledstudents', (req, res) => {
  models.subject.findById(req.params.id)
  .then(subject => {
    subject.getStudents()
    .then(students => {
      // res.render('subjects-enrolledstudents', {subject: subject, students: students})
      res.send(students)
    })
  })
})

router.get('/:conjunctionId/givescore', (req, res) => {
  res.render('subjects-givescore', {id: req.params.conjunctionId})
})

router.post('/:conjunctionId/givescore', (req, res) => {
  models.student_subject.update(req.body, {where: {id: req.params.conjunctionId}})
  .then(() => {
    res.redirect('subjects')
  })
})

module.exports = router
