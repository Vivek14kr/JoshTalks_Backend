const express = require("express");
const cors = require("cors");
const UserController = require("./controllers/auth.controller.js");
const ListController = require("./controllers/List.controller.js");
const ItemController = require("./controllers/Item.controller.js");
const app = express();



app.use(cors());
app.use(express.json());

app.use("/users", UserController);
app.use("/lists", ListController);
app.use("/items", ItemController);

module.exports = app;
