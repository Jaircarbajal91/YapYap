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
			Image.hasOne(models.User, { foreignKey: "imageId" });
			Image.hasOne(models.Message, { foreignKey: "imageId" });
			Image.hasOne(models.Server, { foreignKey: "imageId" });
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
