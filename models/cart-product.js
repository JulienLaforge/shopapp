const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const CartProduct = sequelize.define(
  'cartProduct',
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

module.exports = CartProduct;