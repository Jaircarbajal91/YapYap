'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.User, { foreignKey: "user_id" });
      Image.belongsTo(models.Server, { foreignKey: "server_id" });
      Image.belongsTo(models.Message, { foreignKey: "message_id" });
    }
  }
  Image.init({
    type: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
