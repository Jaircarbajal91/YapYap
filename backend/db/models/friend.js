"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Friend extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Friend.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user",
				onDelete: "CASCADE",
			});
			Friend.belongsTo(models.User, {
				foreignKey: "friendId",
				as: "friend",
				onDelete: "CASCADE",
			});
		}
	}
	Friend.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			friendId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Friend",
		}
	);
	return Friend;
};

