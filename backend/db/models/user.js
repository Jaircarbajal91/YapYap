"use strict";
const { Model, Validator, ValidationErrorItemOrigin } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		toSafeObject() {
			const { id, username, email } = this; // context will be the User instance
			return { id, username, email };
		}

		validatePassword(password) {
			return bcrypt.compareSync(password, this.hashedPassword.toString());
		}

		static getCurrentUserById(id) {
			return User.scope("currentUser").findByPk(id);
		}

		static async login({ credential, password }) {
			const { Op } = require("sequelize");
			const user = await User.scope("loginUser").findOne({
				where: {
					[Op.or]: {
						username: credential,
						email: credential,
					},
				},
			});
			if (user && user.validatePassword(password)) {
				return await User.scope("currentUser").findByPk(user.id);
			}
		}

		static async signup({ username, email, password, alias, imageId }) {
			const hashedPassword = bcrypt.hashSync(password);
			const user = await User.create({
				username,
				email,
				alias,
				imageId,
				hashedPassword,
			});
			return await User.scope("currentUser").findByPk(user.id);
		}
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.ChatMember, {
				foreignKey: "user_id",
				onDelete: "CASCADE",
			});
			User.hasMany(models.Message, { foreignKey: "sender_id" });
			User.hasOne(models.Image, {
				foreignKey: "id",
				sourceKey: "imageId",
				onDelete: "CASCADE",
			});
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [4, 20],
					isNotEmail(value) {
						if (Validator.isEmail(value))
							throw new Error("Username cannot be an email.");
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [3, 256],
					isEmail: true,
				},
			},
			hashedPassword: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [60, 60],
				},
			},
			alias: {
				type: DataTypes.STRING,
				validate: {
					len: [4, 20],
				},
			},
			imageId: {
				type: DataTypes.INTEGER,
			},
		},
		{
			sequelize,
			modelName: "User",
			defaultScope: {
				attributes: {
					exclude: ["hashedPassword", "createdAt", "updatedAt"],
				},
			},
			scopes: {
				currentUser: {
					attributes: { exclude: ["hashedPassword"] },
				},
				loginUser: {
					attributes: {},
				},
			},
		}
	);
	return User;
};
