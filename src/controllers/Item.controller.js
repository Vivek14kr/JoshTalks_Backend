const express = require("express");

const router = express.Router();
const authenticate = require("../utils/auth");
const List = require("../models/List.models")

const Item = require("../models/Item.models")

router.get("/get-items/:id", authenticate, async (req, res) => {
  let listId = req.params.id;

 let userId = ""
     if (!req.user.id) {
       return res.status(403).json({ error: "Unauthorized access" });
     }
     userId = req.user.id;


  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    const items = await Item.find({ userId: userId , listId:listId})

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/items/:id", authenticate,async (req, res) => {
  const itemId = req.params.id;
  let userId = "";
  if (!req.user.id) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  userId = req.user.id;


  if (!itemId) {
    return res.status(400).json({ message: "Item ID parameter is required" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    const item = await Item.findOne({ _id: itemId, userId: userId }).populate(
      "listId"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/add-items/:list_id", authenticate, async (req, res) => {
   if (!req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
  const listId = req.params.list_id;
  const item = new Item({
    name: req.body.name,
    isComplete: req.body.isComplete? true : false,
    
    listId:listId,
    userId:req.user.id
  });


  const list = await List.findById(listId);

  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }

 
  list.items.push(item._id);
  await list.save();

 
  await item.save();

  res.json({data:item,
  "message":"Task Added"
  });
});


// Update a list by ID
router.patch("/edit-items/:id", authenticate, async (req, res) => {
  const itemId = req.params.id;
  let userId = "";
   if (!req.user.id) {
     return res.status(403).json({ error: "Unauthorized access" });
   }
   userId = req.user.id;
   


  if (!itemId) {
    return res.status(400).json({ message: "List ID parameter is required" });
  }

  

  try {
    const updatedList = await Item.findOneAndUpdate(
      { _id: itemId, userId: userId },
    req.body,
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json({data:updatedList});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a list by ID
router.delete("/delete-items/:id", authenticate, async (req, res) => {
  const itemId = req.params.id;
   let userId = "";
   if (!req.user.id) {
     return res.status(403).json({ error: "Unauthorized access" });
   }
   userId = req.user.id;

  if (!itemId) {
    return res.status(400).json({ message: "List ID parameter is required" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID parameter is required" });
  }

  try {
    // Find the list and remove it
    const list = await Item.findOneAndRemove({ _id: itemId, userId: userId });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Find all items in the list and remove them
    

    res.json({ message: "List and associated items deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;