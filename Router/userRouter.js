const express = require("express")
const User = require("../Model/user")
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", (req, resp) => {
  resp.render("index");
});

router.get("/home", auth, async (req, resp) => {
  try {
    const users = await User.find();
    resp.render("home", { "data": users });
  } catch (error) {
    resp.render("index", { err: "Something went wrong !!!!" });
  }
});


router.post("/reg", upload.single("file"), async (req, resp) => {
  try {
    id = req.body.id;
    if (id) {
      const user = await User.findByIdAndUpdate(id, req.body);
      resp.render("index", { msg: "update successfully" });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        image: req.file.filename,
      });
      await user.save();
      resp.render("index", { msg: "registeration successfully!!!" });
    }
  } catch (error) {
    console.log(error);

    resp.render("index", { err: "something went wrong!!!" });
  }
});

router.get("/delete",auth, async (req, resp) => {
  const id = req.query.id;
  try {
    const dt = await User.findByIdAndDelete(id);
    resp.redirect("home");
  } catch (error) {}
});

router.get("/update",auth, async (req, resp) => {
  const id = req.query.id;
  try {
    const user = await User.findById(id);
    resp.render("index", { "data": user });
  } catch (error) {}
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post("/userlogin", async (req, resp) => {
  try {

    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    // if (user.Tokens.length >= 3);
    // {
    //   resp.render("login", { err: "max user limit reached!!!" });
    //   return;
    // }

    if (user) {
      isValid = await bcrypt.compare(req.body.password, user.password);
      if (isValid) {
        // const token = await jwt.sign({ _id: user._id }, process.env.S_KEY);
        const token=await user.generateToken();
        resp.cookie("token", token);
        resp.redirect("home");
      } else {
        resp.render("login", { "err": "invalid email or password" });
      }
    } else {
      resp.render("login", { "err": "invalid email or password" });
    }
  } catch (error) {
    console.log(error);

    resp.render("login", { "err": "something went wrong" });
  }
});

router.get("/logout", auth, (req, resp) => {
  const user = req.user;
  const token = req.token;

  user.Tokens = user.Tokens.filter(ele => {
    return ele.token != token;
  });
  user.save();
  resp.clearCookie("token");
  resp.render("login");
});

router.get("/logoutall", auth, (req, resp) => {
  const user = req.user;
  const token = req.token;

  user.Tokens = [];
  user.save();
  resp.clearCookie("token");
  resp.render("login");
});
module.exports = router;
