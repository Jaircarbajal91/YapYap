const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: 'sequelize',
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    dialect: "postgres",
    use_env_variable: 'DATABASE_URL',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
