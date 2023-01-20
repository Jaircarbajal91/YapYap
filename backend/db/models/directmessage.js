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
      DirectMessage.hasMany(models.Message, { foreignKey: "dm_id", sourceKey: "id", onDelete: "CASCADE" });
      DirectMessage.hasMany(models.ChatMember, { foreignKey: "dm_id", onDelete: "CASCADE" });
    }
  }
  DirectMessage.init({
    serial_number: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'DirectMessage',
  });
  return DirectMessage;
};
