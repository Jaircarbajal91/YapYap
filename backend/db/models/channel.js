"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Channel extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Channel.hasMany(models.Message, {
				foreignKey: "channelId",
				onDelete: "CASCADE",
			});
			Channel.belongsTo(models.Server, { foreignKey: "serverId" });
		}
	}
	Channel.init(
		{
			channel_name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 20],
				},
			},
			serverId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Channel",
		}
	);
	return Channel;
};
