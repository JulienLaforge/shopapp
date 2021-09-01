const Sequelize = require('sequelize');

console.log("****************");
console.log("****************");
console.log(process.env);
console.log("****************");
console.log("****************");
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  { 
    dialect: 'mysql'
  });

module.exports = sequelize;