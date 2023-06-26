const { getdb } = require("../utils/database");
const { ObjectId } = require("mongodb");
class Product {
  constructor(title, description, price, imgUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imgUrl = imgUrl;
  }
  save() {
    const db = getdb();
    db.collection("products")
      .insertOne(this)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
  static findOneProduct(id) {
    const db = getdb();
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(id) })
      .then((product) => product)
      .catch((err) => {
        console.log(err);
      });
  }

  static updateOneProduct(id, title, description, price, imgUrl) {
    const db = getdb();
    return db
      .collection("products")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title: title,
            description: description,
            price: price,
            imgUrl: imgUrl,
          },
        }
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteOneProduct = (id) => {
    const db = getdb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => result)
      .catch((err) => {
        console.log(err);
      });
  };

  static allProducts() {
    const db = getdb();
    return db
      .collection("products")
      .find({})
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
