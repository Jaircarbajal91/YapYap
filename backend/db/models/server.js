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
    }
  }
  Server.init({
    server_name: DataTypes.STRING,
    image_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Server',
  });
  return Server;
};