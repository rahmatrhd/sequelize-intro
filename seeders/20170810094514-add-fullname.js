'use strict';

const models = require('../models')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return new Promise ((resolve, reject) => {
      models.student.findAll()
      .then(students => {
        let studentPromises = students.map(student => {
          return new Promise((res, rej) => {
            models.student.update({full_name: `${student.first_name} ${student.last_name}`}, {where: {id: student.id}})
            .then(() => {
              res(student)
            })
          })
        })

        Promise.all(studentPromises)
        .then(rows => {
          resolve(rows)
        })
        .catch(err => {
          reject(err)
        })
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
