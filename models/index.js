const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// I'm lazy, I'm copy/pasted
const envOrNull = key => process.env[key] ?? null
const envOrError = (key) => {
  const val = process.env[key]
  if (val && val.length > 0) {
    return val
  }
  throw new MissingEnvironmentVariableError(key)
}

class MissingEnvironmentVariableError extends Error {
  constructor(key) {
    super(`${key} must be provided`)
    this.name = 'MissingEnvironmentVariableError'
  }
}

/**
 * Here we removed the branching in the setup of the client for a more reliable
 * usage later down the road given different setups.
 */
const databasePath = envOrNull('DATABASE_PATH')
const sequelize = new Sequelize(
  envOrError('DATABASE'),
  envOrError('DATABASE_USER'),
  envOrError('DATABASE_PASSWD'),
  {
    dialect: 'sqlite',
    storage: databasePath ?? ':memory'
  }
)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
