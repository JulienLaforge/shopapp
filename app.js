const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User
    .findById('6135e09ef9f64f1c77426057')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://'
    + process.env.MONGO_USER
    + ':'
    + process.env.MONGO_PASSWORD
    + '@shop.txgkv.mongodb.net/shop')
  .then(() => {
    User.findOne().then(user => {
      if(!user)  {
        const user = new User({
          name: "Julien",
          email: "julien.a.laforge@gmail.com",
          cart: {items: []}
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('Connected!')
  })
  .catch(err => console.log(err));
