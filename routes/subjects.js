const express = require('express')
let router = express.Router()
const models = require('../models')

const studentScore = require('../helpers/student-score')

router.use((req, res, next) => {
  if (req.session.hasOwnProperty('username'))
    switch (req.session.role) {
      case 'academic':
      case 'headmaster':
        next()
        break;
      default:
        res.send('Access denied!')
    }
  else
    res.redirect('/login')
})

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
      res.render('subjects', {
        title: 'Subjects',
        data: subjects,
        session: req.session
      })
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
        students: students.map(student => {return studentScore(student)}),
        session: req.session
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
      subjectId: req.params.subjectId,
      session: req.session
    })
  })
})

router.post('/:subjectId/givescore/:studentId', (req, res) => {
  models.student_subject.update(req.body, {
    where: {
      subjectId: req.params.subjectId,
      studentId: req.params.studentId
    }
  })
  .then(() => {
    res.redirect(`/subjects/${req.params.subjectId}/enrolledstudents`)
  })
})

module.exports = router
