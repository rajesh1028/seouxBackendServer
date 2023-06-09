const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const fs = require("fs");
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();
userRouter.use(cookieParser());

userRouter.get("/getUsers", async (req, res) => {
  let users = await UserModel.find();
  res.json(users);
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, pass, email, age, gender } = req.body;

    const already = await UserModel.findOne({ email });
    console.log(already);
    if (already) {
      res.json("user already exists");
    } else {
      bcrypt.hash(pass, 5, async (err, hashpass) => {
        if (err) {
          res.json("error while hashing password");
        } else {
          const user = await UserModel.insertMany({
            name,
            pass: hashpass,
            email,
            age,
            gender,
          });
          res.json({ msg: "registration sucessfull" });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});


userRouter.post("/login", async (req, res) => {
  const { pass, email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.json({ msg: "user does not exist" });
  } else {
    bcrypt.compare(pass, user.pass, async (err, result) => {
      if (err) {
        res.json({ msg: "wrong credential" });
      } else {
        if (result) {
          var normaltoken = jwt.sign({ userId: user._id }, process.env.normalkey, { expiresIn: "1h" });
          var refreshtoken = jwt.sign({ userId: user._id }, process.env.refreshkey, { expiresIn: "7d" });
          res.cookie("normaltoken", normaltoken, { httpOnly: true, maxAge: 1000000 }).cookie("refreshtoken", refreshtoken, { httpOnly: true, maxAge: 100000 })
          res.locals.normaltoken = normaltoken;
          console.log(user._id)
          res.json({
            msg: "logged in successfully",
            id: user._id,
            name: user.name,
          });
        } else {
          res.json({ msg: "wrong credential" });
        }
      }
    });
  }
});


userRouter.get("/logout", (req, res) => {
  console.log("logout successfully");
  let kk = req.cookies.normaltoken;
  let fil = fs.readFileSync("./blacklist.json", "utf-8");
  let data = JSON.parse(fil);
  data.push(kk);
  fs.writeFileSync("./blacklist.json", JSON.stringify(data));

  res.clearCookie("normaltoken").clearCookie("refreshtoken");
  res.json("logout successfully");
});


userRouter.patch("/update", async (req, res) => {

  const { email, pass } = req.body;

  const data = await UserModel.findOne({ email: email });

  console.log(pass);

  try {

    bcrypt.hash(pass, 5, async (err, hashpass) => {
      if (err) {
        res.json(err);
        console.log(err);
      } else {
        let noteData = await UserModel.findByIdAndUpdate(
          { _id: data._id },
          { pass: hashpass }
        );
        console.log(noteData);
        res.json("password updated");
      }
    });

  } catch (error) {
    console.log(error);
    console.log("something went wrong");
  }
});


module.exports = { userRouter };
