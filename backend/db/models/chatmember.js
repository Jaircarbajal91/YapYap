'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatMember.hasMany(models.User, { foreignKey: "user_id" });
      ChatMember.hasMany(models.Server, { foreignKey: "server_id" });
      ChatMember.hasMany(models.DirectMessage, { foreignKey: "dm_id" });
    }
  }
  ChatMember.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    server_id: DataTypes.INTEGER,
    dm_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChatMember',
  });
  return ChatMember;
};
