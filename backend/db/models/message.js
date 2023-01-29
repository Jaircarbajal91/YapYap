"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Message extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Message.hasOne(models.User, { foreignKey: "senderId" });
			Message.hasOne(models.Channel, { foreignKey: "channelId" });
			Message.hasMany(models.Image, {
				foreignKey: "id",
				sourceKey: "imageId",
				onDelete: "CASCADE",
			});
		}
	}
	Message.init(
		{
			message: {
				type: DataTypes.STRING,
				validate: {
					len: [0, 256],
				},
			},
			senderId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			channelId: {
				type: DataTypes.INTEGER,
			},
			imageId: {
				type: DataTypes.INTEGER,
			},
			dmId: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "Message",
		}
	);
	return Message;
};
