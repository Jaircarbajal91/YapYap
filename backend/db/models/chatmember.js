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
      ChatMember.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
      ChatMember.belongsTo(models.Server, { foreignKey: "server_id", onDelete: "CASCADE" });
      ChatMember.belongsTo(models.DirectMessage, { foreignKey: "dm_id", onDelete: "CASCADE" });
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
