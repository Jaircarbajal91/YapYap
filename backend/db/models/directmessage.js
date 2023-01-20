'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DirectMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DirectMessage.belongsToMany(models.User, { through: "DMMembers", foreignKey: "dm_id", otherKey: "user_id" });
      DirectMessage.hasMany(models.Message, { foreignKey: "dm_id", onDelete: "CASCADE" });
    }
  }
  DirectMessage.init({
    serial_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DirectMessage',
  });
  return DirectMessage;
};
