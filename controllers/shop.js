// const OrderProduct = require('../models/order-product');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render(
        'shop/product-list',
        {
          products,
          pageTitle: 'All products',
          path: '/products',
        }
      );
    })
    .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product =>
      res.render(
        'shop/product-detail',
        {
          product,
          pageTitle: product.title,
          path: '/products',
        }
      )
    )
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render(
        'shop/index',
        {
          products,
          pageTitle: 'Shop',
          path: '/',
        }
      );
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render(
        'shop/cart',
        {
          pageTitle: 'My cart',
          path: '/cart',
          products
        }
      );
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render(
        'shop/orders',
        {
          pageTitle: 'My orders',
          path: '/orders',
          orders
        }
      );
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .addOrder()
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render(
//     'shop/checkout',
//     {
//       pageTitle: 'Checkout',
//       path: '/checkout'
//     }
//   );
// }

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product
    .findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};
