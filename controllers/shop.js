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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(p => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty
          });
        }
      }
      res.render(
        'shop/cart',
        {
          pageTitle: 'My cart',
          path: '/cart',
          products: cartProducts
        }
      );
    });
  });
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
  Product.findProductById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};