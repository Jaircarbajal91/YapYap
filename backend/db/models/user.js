'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = ( sequelize, DataTypes ) => {
    class User extends Model {
        toSafeObject() {
            const { id, username, email, alias } = this;
            return { id, username, email, alias };
        }

        validatePassword(password) {
            return bcrypt.compareSync(password, this.hashedPassword.toString());
        }

        static getCurrentUserById(id) {
            return User.scope('currentUser').findByPk(id);
        }

        static async login({ credential, password }) {
            const { Op } = require('sequelize');
            const user = await User.scope('loginUser').findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential,
                    }
                }
            });
            if (user && user.validatePassword(password)) {
                return await User.scope('currentUser').findByPk(user.id);
            }
        }

        static async signup({ username, email, password, firstName, lastName, alias }) {
            const hashedPassword = bcrypt.hashSync(password);
            const user = await User.create({
                firstName,
                lastName,
                username,
                email,
                alias,
                hashedPassword
            });

            return await User.scope('currentUser').findByPk(user.id);
        }

        static associate(models) {
            // define associations here
            // User.hasMany(models.Chat, { foreignKey: "chatId", onDelete: "CASCADE" });

        }
    };

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) throw new Error("Username cannot be an email.");
                    }
                }
            },
            // firstName: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            // lastName: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 256]
                }
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60]
                }
            }
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: {
                    exclude: ['hashedPassword', 'username', 'createdAt', 'updatedAt']
                }
            },
            scopes: {
                currentUser: {
                    attributes: { exclude: ['hashedPassword'] },
                },
                loginUser: {
                    attributes: {},
                }
            }
        }
    );
    return User;
}
