const express = require("express");

const router = express.Router();
const List = require("../models/List.models");
const authenticate = require("../utils/auth");
const Item = require("../models/Item.models");
const User = require("../models/User.models");

router.post("/add-lists", authenticate, async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const User_new = await User.findById(req.user.id);

    const newList = new List({
      name: req.body.name,
      description: req.body.description,
      userId: req.user.id,
    });
    User_new.lists.push(newList);
    await User_new.save();

    const savedList = await newList.save();
    res.json(savedList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all lists for a specific user
router.get("/get-user-lists", authenticate, async (req, res) => {
  if (!req.user.id) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    const lists = await List.find({ userId: userId }).populate("items");

    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific list by ID
router.get("/all-lists", authenticate, async (req, res) => {
  if (!req.user.id) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  
  const lis = await List.find().populate("userId");
  console.log(lis, " checking list")
  const lists = lis.filter(
    (list) =>{
 
      return list.userId._id.toString() !== req.user.id}
  );

  try {
   

    if (!lists) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json({data: lists});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a list by ID
router.patch("/edit-lists/:id", authenticate, async (req, res) => {
  const listId = req.params.id;
  let userId = "";
   if (!req.user.id) {
     return res.status(403).json({ error: "Unauthorized access" });
   }
   userId = req.user.id;
   


  if (!listId) {
    return res.status(400).json({ message: "List ID parameter is required" });
  }

  

  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: listId, userId: userId },
    req.body,
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a list by ID
router.delete("/delete-lists/:id", authenticate, async (req, res) => {
  const listId = req.params.id;
   let userId = "";
   if (!req.user.id) {
     return res.status(403).json({ error: "Unauthorized access" });
   }
   userId = req.user.id;

  if (!listId) {
    return res.status(400).json({ message: "List ID parameter is required" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    // Find the list and remove it
    const list = await List.findOneAndRemove({ _id: listId, userId: userId });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Find all items in the list and remove them
    await Item.deleteMany({ listId: listId });

    res.json({ message: "List and associated items deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
