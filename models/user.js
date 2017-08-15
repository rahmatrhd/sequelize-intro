'use strict';
const crypto = require('crypto')

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    salt: {
      type: DataTypes.STRING,
      unique: {
        msg: 'salt must be unique'
      }
    }
  });

  user.beforeCreate(model => {
    model.password = crypto.createHmac('sha256', model.salt).update(model.password).digest('hex');
  })

  return user;
};
