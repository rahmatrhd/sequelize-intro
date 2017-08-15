'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('teachers', 'subjectId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('teachers', 'subjectId')
  }
};
