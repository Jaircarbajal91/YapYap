'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Channel, { foreignKey: "channel_id" });
      Message.belongsTo(models.User, { foreignKey: "sender_id" });
      Message.hasMany(models.Image, { foreignKey: "image_id" });
      Message.belongsTo(models.Dm, { foreignKey: "dm_id" });
    }
  }
  Message.init({
    message: DataTypes.STRING,
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      validate: { len: [1, 30] }
    },
    channel_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Channels', key: 'id' },
      onDelete: 'CASCADE',
    },
    image_id: DataTypes.INTEGER,
    dm_id: {
      type: DataTypes.INTEGER,
      references: { model: "DirectMessages", key: "id" },
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
