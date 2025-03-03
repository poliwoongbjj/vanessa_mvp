var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const db = require("../model/helper");
require("dotenv").config();
const saltRounds = 10;

const supersecret = process.env.SUPER_SECRET;

// Register a new student user
router.post("/register", async (req, res) => {
  console.log(req.body);
});

module.exports = router;
