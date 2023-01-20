'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DMMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DMMember.init({
    user_id: DataTypes.INTEGER,
    dm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DMMember',
  });
  return DMMember;
};