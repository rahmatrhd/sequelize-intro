const express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
  redirect('/teachers')
})

module.exports = router
