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
      Channel.hasMany(models.Message, { foreignKey: "channel_id", onDelete: "CASCADE" });
      Channel.belongsTo(models.Server, { foreignKey: "server_id" });
    }
  }
  Channel.init({
    channel_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 20]
      }
    },
    server_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};
