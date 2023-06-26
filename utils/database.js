const mongodb = require("mongodb");
const myMongoClient = mongodb.MongoClient;
const url = "mongodb://127.0.0.1:27017/shop";

let _db;

const mongoConnect = (callback) => {
  myMongoClient
    .connect(url)
    .then((result) => {
      console.log("Connection with db was successful");
      callback(result);
      _db = result.db();
    })
    .catch((err) => console.log(err));
};

const getdb = () => {
  if (_db) {
    return _db;
  } else {
    throw new Error("Database connection not established.");
  }
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;
