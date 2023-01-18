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
      DirectMessage.hasMany(models.Message, { foreignKey: "id", sourceKey: "message_id", onDelete: "CASCADE" });
      DirectMessage.hasMany(models.ChatMember, { foreignKey: "dm_id", onDelete: "CASCADE" });
    }
  }
  DirectMessage.init({
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'DirectMessage',
  });
  return DirectMessage;
};
