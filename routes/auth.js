const router = require("express").Router();
const {User} = require("../src/models/user");
//const CryptoJS = require("crypto.js")
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password:bcrypt.hashSync(req.body.password,10),
    phone:req.body.phone,
    isAdmin:req.body.isAdmin
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  console.log(req.body.username,85);
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    !user && res.status(401).json("Wrong User Name");
    console.log(user,236)
    
    if(user && bcrypt.compareSync(req.body.password,user.password))
    {
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
