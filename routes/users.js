const { User } = require("../src/models/user");
const express = require("express");
const router = express.Router();
const jwt=require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


router.get(`/`,verifyTokenAndAdmin, async (req, res) => {
    const userList = await User.find();
  
    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  });
  
  router.get(`/:id`,verifyTokenAndAuthorization, async (req, res) => {
    const userList = await User.findById(req.params.id);
  
    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  });
  

  router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }
  
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        password:newPassword,
        phone: req.body.phone
      },
      { new: true }
    );
    if (!user) return res.status(400).send("the user cannot be created");
  
    res.send(user);
  });

  router.delete("/:id",verifyTokenAndAuthorization, async(req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (user) {
          return res
            .status(200)
            .json({ success: true, message: "the user deleted" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "user not found" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  });
  module.exports = router;