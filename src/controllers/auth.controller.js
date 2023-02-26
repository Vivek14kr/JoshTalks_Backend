const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.models");
const authenticate = require("../utils/auth");

const router = express.Router();


router.get('', async (req, res)=>{
  try {
    
    let users = await User.find().populate("lists").lean().exec();
    
    res.status(400).json({ data: users});
  } catch (error) {
    
  }
})
router.post("/signup", (req, res) => {
  try {
    const { username, email, password} = req.body;

    User.findOne({ email }).then((user) => {
      if (user) {
        res.status(400).json({ message: "Email already exists" });
      } else {
        bcrypt.hash(req.body.password, 8, function (err, hash) {
          if (err) return res.json({ error: true });
          else {
            const newUser = new User({
              username,
              email,
              password: hash,
            });

            newUser.save();
            const token = jwt.sign(
              { id: newUser._id},
              "mynameisvivekkumaryadavokdkfidfhdifijhugbyigndfksdn",
              { expiresIn: "1d" }
            );
            // Return the token and user information
            res.json({ token, newUser });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "Invalid email or password" });
    } else {
      let result = bcrypt.compareSync(password, user.password);

      if (result) {
        const token = jwt.sign(
          { id: user._id },
          "mynameisvivekkumaryadavokdkfidfhdifijhugbyigndfksdn",
          {
            expiresIn: "1d",
          }
        );

        res.json({
          message:"Login successful",

          name: user,

          token: token,
        });
      } else {
        res.status(404).json({ message: "Invalid email or password" });
      }
    }
  });
});

router.get("/verify", authenticate, (req, res) => {
  res.json({ message: "Token is valid" });
});

module.exports = router;