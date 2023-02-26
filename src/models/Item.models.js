// Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
    required: false,
    
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
