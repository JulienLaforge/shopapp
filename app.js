const express = require('express');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add product</button></form>');
});

app.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello, friend.</h1>');
});

app.listen(3000);