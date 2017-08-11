'use strict';
module.exports = function(sequelize, DataTypes) {
  var teacher = sequelize.define('teacher', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    subjectId: DataTypes.INTEGER
  });

  teacher.associate = models => {
    teacher.belongsTo(models.subject)
  }

  return teacher;
};
