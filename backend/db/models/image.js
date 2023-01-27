"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Image extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
      Image.hasOne(models.User, { foreignKey: "image_id" })
      Image.hasOne(models.Message, { foreignKey: "image_id" })
      Image.hasOne(models.Server, { foreignKey: "image_id" })
		}
	}
	Image.init(
		{
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Image",
		}
	);
	return Image;
};
