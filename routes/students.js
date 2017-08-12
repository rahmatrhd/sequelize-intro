const express = require('express')
let router = express.Router()
const models = require('../models')

router.get('/', (req, res) => {
  models.student.findAll()
  .then(rows => {
    res.render('students', {data: rows})
  })
})

router.get('/add', (req,res) => {
  res.render('students-add', {err: req.query.err})
})

router.post('/add', (req, res) => {
  req.body.full_name = `${req.body.first_name} ${req.body.last_name}`
  models.student.create(req.body)
  .then(() => {
    res.redirect('/students')
  })
  .catch(err => {
    res.redirect(`./add?err=${err.errors[0].message}`)
  })
})

router.get('/edit/:id', (req,res) => {
  models.student.findById(req.params.id)
  .then(row => {
    res.render('students-edit', {
      data: row,
      err: req.query.err
    })
  })
  .catch(err => {
    throw err
  })
})

router.post('/edit/:id', (req, res) => {
  req.body.full_name = `${req.body.first_name} ${req.body.last_name}`
  models.student.update(req.body, {where: {id: req.params.id}})
  .then(() => {
    res.redirect('/students')
  })
  .catch(err => {
    res.redirect(`./${req.params.id}?err=${err.errors[0].message}`)
  })
})

router.get('/delete/:id', (req, res) => {
  models.student.destroy({where: {id: req.params.id}})
  .then(() => {
    res.redirect('/students')
  })
})

router.get('/:id/addsubject', (req, res) => {
  models.student.findById(req.params.id)
  .then(student => {
    models.subject.findAll()
    .then(combobox => {
      let promises = combobox.map(combo => {
        return new Promise((resolve, reject) => {
          models.student_subject.findOne({where: {subjectId: combo.id, studentId: student.id}})
          .then(jaenal => {
            if (jaenal)
              combo.checked = true
            resolve(combo)
          })
        })
      })

      Promise.all(promises)
      .then(combobox => {
        res.render('students-addsubject', {student: student, combobox: combobox})
      })
    })
  })
})

router.post('/:id/addsubject', (req, res) => {
  models.student_subject.destroy({where: {studentId: req.params.id}})
  .then(() => {
    return models.student_subject.bulkCreate(req.body.subjectId.map(subjectId => {
      return {
        subjectId: subjectId,
        studentId: req.params.id
      }
    }))
  })
  .then(() => {
    res.redirect('/students')
  })
})

module.exports = router
