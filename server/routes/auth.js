const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A request is coming in to auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgobj = {
    message: "Test API is working",
  };
  return res.json(msgobj);
});

router.post("/register", async (req, res) => {
  //check the validation of data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email has been registered");

  //register the user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      saveObject: saveUser,
    });
  } catch (err) {
    res.status(400).send("User not saved");
  }
});

router.post("/login", (req, res) => {
  //check the validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(400).send("User is not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        //if success create jsonwebtoken
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: `JWT` + " " + token, user });
        } else {
          console.log(err);
          res.status(401).send("Wrong password.");
        }
      });
    }
  });
});

module.exports = router;