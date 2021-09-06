const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  const updatedCart = {
    items: updatedCartItems
  }

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  this.cart = updatedCart;

  return this.save()
}

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()
  });
  this.cart.items = updatedCartItems;

  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//
//   save() {
//     const db = getDb();
//
//     return db
//       .collection('users')
//       .insertOne(this);
//   }
//
//   addToCart(product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     const updatedCart = {
//       items: updatedCartItems
//     }
//
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);
//
//     return db
//       .collection('products')
//       .find({ _id: {$in: productIds} })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           };
//         });
//       })
//       .catch(err => console.log(err));
//   }
//
//   deleteItemFromCart(productId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(i => {
//       return i.productId.toString() !== productId.toString()
//     });
//
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: {items: updatedCartItems} } }
//       );
//   }
//
//   addOrder() {
//     const db = getDb();
//
//     return this.getCart().then(items => {
//       const order = {
//         items,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       };
//
//       return db
//         .collection('orders')
//         .insertOne(order);
//       })
//       .then(() => {
//         this.cart = {items: []};
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] }}}
//           )
//       });
//   }
//
//   getOrders() {
//     const db = getDb();
//
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }
//
//   static findById(userId) {
//     const db = getDb();
//
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) });
//   }
// }
//
// module.exports = User;
