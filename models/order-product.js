const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const OrderProduct = sequelize.define(
  'orderProduct',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    quantity: Sequelize.INTEGER
  }
);

module.exports = OrderProduct;