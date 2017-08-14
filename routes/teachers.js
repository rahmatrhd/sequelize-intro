const express = require('express')
let router = express.Router()
const models = require('../models')

router.use((req, res, next) => {
  if (req.session.hasOwnProperty('username'))
    switch (req.session.role) {
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
  models.teacher.findAll()
  .then(teachers => {
    let promises = teachers.map(teacher => {
      return new Promise((resolve, reject) => {
        teacher.getSubject()
        .then(subject => {
          if (teacher.subjectId != null)
            teacher.subject = subject.subject_name

          return resolve(teacher)
        })
      })
    })

    Promise.all(promises)
    .then(teachers => {
      // console.log(teachers);
      res.render('teachers', {
        title: 'Teachers',
        data: teachers,
        session: req.session
      })
    })
    .catch(err => {
      throw err
    })
  })
})

router.get('/add', (req, res) => {
  res.render('teachers-add', {
    title: 'Add Teacher',
    err: req.query.err,
    session: req.session
  })
})

router.post('/add', (req, res) => {
  models.teacher.create(req.body)
  .then(() => {
    res.redirect('/teachers')
  })
  .catch(err => {
    res.redirect(`./add?err=${err.errors[0].message}`)
  })
})

router.get('/edit/:id', (req,res) => {
  models.teacher.findById(req.params.id)
  .then(teacher => {
    models.subject.findAll()
    .then(subjects => {
      res.render('teachers-edit', {
        title: 'Edit Teacher',
        data: teacher,
        combobox: subjects,
        err: req.query.err
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

router.post('/edit/:id', (req, res) => {
  models.teacher.update(req.body, {where: {id: req.params.id}})
  .then(() => {
    res.redirect('/teachers')
  })
  .catch(err => {
    res.redirect(`./${req.params.id}?err=${err.errors[0].message}`)
  })
})

router.get('/delete/:id', (req, res) => {
  models.teacher.destroy({where: {id: req.params.id}})
  .then(() => {
    res.redirect('/teachers')
  })
})

module.exports = router
