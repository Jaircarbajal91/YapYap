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
      Image.belongsTo(models.User, { foreignKey: "image_id", onDelete: "CASCADE" });
      Image.belongsTo(models.Message, { foreignKey: "image_id", onDelete: "CASCADE" });
      Image.belongsTo(models.Server, { foreignKey: "image_id", onDelete: "CASCADE" });
    }
  }
  Image.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: DataTypes.STRING,
    allowNull: false
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
