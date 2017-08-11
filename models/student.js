'use strict';
module.exports = function(sequelize, DataTypes) {
  var student = sequelize.define('student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    full_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'email sama'
      },
      validate: {
        isEmail: {
          msg: 'Email gabener'
        }
      }
    }
  });

  student.associate = models => {
    student.belongsToMany(models.subject, {through: models.student_subject})
  }

  return student;
};
