const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      editing: false
    }
  );
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });

  product
    .save()
    .then(() => {
      console.log('Product created!')
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.redirect('/');
  }
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render(
        'admin/edit-product',
        {
          pageTitle: 'Edit product',
          path: '/admin/edit-product',
          editing: editMode,
          product
        }
      );
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;

  Product
    .findById(productId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(() => {
      console.log('Product updated!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .select('-_id')
    .populate('userId')
    .then(products => {
      res.render(
        'admin/products',
        {
          products,
          pageTitle: 'Admin products',
          path: '/admin/products',
        }
      );
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product
    .findByIdAndRemove(productId)
    .then(() => {
      console.log('Product destroyed!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
