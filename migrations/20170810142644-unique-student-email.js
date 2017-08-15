'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('students', 'email', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('students', 'email', {
      type: Sequelize.STRING
    })
  }
};
