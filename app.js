const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');
const db = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')
//   .then(result => {
//     console.log('PLOP', result[0]);
//     console.log('FLAP', result[1]);
//   })
//   .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(process.env.PORT || 3000);