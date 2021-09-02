const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const Cart = require('./models/cart');
const CartProduct = require('./models/cart-product');
const Order = require('./models/order');
const OrderProduct = require('./models/order-product');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartProduct });
Product.belongsToMany(Cart, { through: CartProduct });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderProduct});
Product.belongsToMany(Order, {through: OrderProduct});

sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Julien', email: 'julien.a.laforge@gmail.com' });
    }
    // return Promise.resolve(user);
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));
