"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ChatMember extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ChatMember.belongsTo(models.User, {
				foreignKey: "userId",
				onDelete: "CASCADE",
			});
			ChatMember.belongsTo(models.Server, {
				foreignKey: "serverId",
				onDelete: "CASCADE",
			});
			ChatMember.belongsTo(models.DirectMessage, {
				foreignKey: "dmId",
				onDelete: "CASCADE",
			});
		}
	}
	ChatMember.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			serverId: DataTypes.INTEGER,
			dmId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "ChatMember",
		}
	);
	return ChatMember;
};
