// List.js
const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    { required: false },
  ],
});

const List = mongoose.model("List", listSchema);

module.exports = List;
