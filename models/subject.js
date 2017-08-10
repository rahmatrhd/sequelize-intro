'use strict';
module.exports = function(sequelize, DataTypes) {
  var subject = sequelize.define('subject', {
    subject_name: DataTypes.STRING
  });

  subject.associate = models => {
    subject.belongsToMany(models.teacher, {through: 'subjectId'})
  }

  return subject;
};
