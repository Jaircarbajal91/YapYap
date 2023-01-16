'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Server extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Server.hasMany(models.ChatMember, {
        foreignKey: "chat_id",
        onDelete: "CASCADE",
      });
    }
  }
  Server.init({
    server_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 20]
      }
    },
    image_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Server',
  });
  return Server;
};
