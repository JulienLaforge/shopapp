const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  // Product.findAll({ where: {id: productId}})
  //   .then(products => {
  //     res.render(
  //       'shop/product-detail',
  //       {
  //         product: products[0],
  //         pageTitle: products[0].title,
  //         path: '/products',
  //       }
  //     )
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(productId)
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
  Product.findAll()
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
    .then(cart => {
      return cart
        .getProducts()
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
        .catch(err => console.log(err));;
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  res.render(
    'shop/orders',
    {
      pageTitle: 'My orders',
      path: '/orders'
    }
  );
}

exports.getCheckout = (req, res, next) => {
  res.render(
    'shop/checkout',
    {
      pageTitle: 'Checkout',
      path: '/checkout'
    }
  );
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        newQuantity = product.cartProduct.quantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { 
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect('/cart')) 
    .catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};