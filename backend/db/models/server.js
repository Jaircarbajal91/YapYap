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
      Server.belongsToMany(models.User, { through: "ServerMembers", foreignKey: "server_id", otherKey: "user_id", onDelete: "CASCADE" });
      Server.hasMany(models.Channel, { foreignKey: "server_id" });
    }
  }
  Server.init({
    server_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    },
    image_id: DataTypes.INTEGER,
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Server',
  });
  return Server;
};
