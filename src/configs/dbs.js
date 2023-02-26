const mongoose = require("mongoose");

module.exports = () => {
  return mongoose.connect(
    "mongodb+srv://vivek13kr:wjM9YkzovYYWmIi9@cluster0.ezla4zr.mongodb.net/test"
  );
};
