'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Channel.init({
    channel_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    server_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Servers', key: 'id' },
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};
