const express = require('express')
let router = express.Router()
const models = require('../models')

const studentScore = require('../helpers/student-score')

router.get('/', (req, res) => {
  models.subject.findAll()
  .then(subjects => {
    let promises = subjects.map(subject => {
      return new Promise((resolve, reject) => {
        subject.getTeachers()
        .then(teachers => {
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
      res.render('subjects', {title: 'Subjects', data: subjects})
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
      res.render('subjects-enrolledstudents', {
        title: 'Enrolled Students',
        subject: subject,
        students: students.map(student => {return studentScore(student)})
      })
    })
  })
})

router.get('/:subjectId/givescore/:studentId', (req, res) => {
  models.student.findById(req.params.studentId)
  .then(student => {
    res.render('subjects-givescore', {
      title: 'Give Score',
      student: student,
      subjectId: req.params.subjectId
    })
  })
})

router.post('/:subjectId/givescore/:studentId', (req, res) => {
  models.student_subject.update(req.body, {where: {subjectId: req.params.subjectId, studentId: req.params.studentId}})
  .then(() => {
    res.redirect(`/subjects/${req.params.subjectId}/enrolledstudents`)
  })
})

module.exports = router
