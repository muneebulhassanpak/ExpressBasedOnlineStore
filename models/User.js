const { getdb } = require("../utils/database");
const { ObjectId } = require("mongodb");
class User {
  constructor(fullname, username, email, password) {
    this.fullname = fullname;
    this.username = username;
    this.email = email;
    this.password = password;
    this.cart = { items: [] };
  }
  save() {
    const db = getdb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  }

  static findOneUser(email, password) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ email: email, password: password })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findUserByEmail(email) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ email: email })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static updateUserPassword(email, password) {
    const db = getdb();
    return db
      .collection("users")
      .updateOne({ email: email }, { $set: { password: password } })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(id) {
    const db = getdb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  }
  static updateCart(id, newCart) {
    const db = getdb();
    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { cart: newCart } })
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
