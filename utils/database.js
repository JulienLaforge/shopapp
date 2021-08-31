const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize('julien_laforge_shopapp', 'root', config.dbPassword, { 
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;