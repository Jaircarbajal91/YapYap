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
    }
  }
  Message.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 256],
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    channel_id: {
      type: DataTypes.INTEGER
    },
    image_id: {
      type: DataTypes.INTEGER
    },
    dm_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
