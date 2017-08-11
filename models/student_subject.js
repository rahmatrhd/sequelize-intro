'use strict';
module.exports = function(sequelize, DataTypes) {
  var student_subject = sequelize.define('student_subject', {
    studentId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  });

  student_subject.associate = models => {
    student_subject.belongsTo(models.student)
    student_subject.belongsTo(models.subject)
  }

  return student_subject;
};
