var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const db = require("../model/helper");
require("dotenv").config();
const saltRounds = 10;

const { userShouldBeLoggedIn } = require("../middlewares/userShouldBeLoggedIn");

const supersecret = process.env.SUPER_SECRET;

// Register a new student user
router.post("/register", async (req, res) => {
  const { username, password, studentId } = req.body;

  try {
    // Check if user already exists
    const checkUser = await db(
      `SELECT * FROM users WHERE username = '${username}'`
    );
    if (checkUser.data.length > 0) {
      return res.status(409).send({ message: "Username already exists" });
    }

    // Check if student exists and doesn't already have an account
    if (studentId) {
      const checkStudent = await db(
        `SELECT * FROM students WHERE id = ${studentId}`
      );
      if (checkStudent.data.length === 0) {
        return res.status(404).send({ message: "Student not found" });
      }

      const checkStudentAccount = await db(
        `SELECT * FROM users WHERE student_id = ${studentId}`
      );
      if (checkStudentAccount.data.length > 0) {
        return res
          .status(409)
          .send({ message: "This student already has an account" });
      }
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert new user (default isAdmin is FALSE)
    await db(
      `INSERT INTO users (username, password, isAdmin, student_id) 
       VALUES ('${username}', '${hash}', FALSE, ${studentId || "NULL"})`
    );

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send({ message: err.message });
  }
});

// Register a new admin (different route)
router.post("/register-admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const checkUser = await db(
      `SELECT * FROM users WHERE username = '${username}'`
    );
    if (checkUser.data.length > 0) {
      return res.status(409).send({ message: "Username already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert new admin user
    await db(
      `INSERT INTO users (username, password, isAdmin) 
       VALUES ('${username}', '${hash}', TRUE)`
    );

    res.status(201).send({ message: "Admin user registered successfully" });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(400).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const result = await db(
      `SELECT * FROM users WHERE username = '${username}'`
    );

    if (result.data.length === 0) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const user = result.data[0];

    // Check if password is correct
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    // Create token payload
    const payload = {
      user_id: user.id,
      username: user.username,
      isAdmin: user.isAdmin ? true : false, // Ensure boolean
    };

    // Add student_id to payload if user is a student
    if (!user.isAdmin && user.student_id) {
      payload.student_id = user.student_id;
    }

    // Create token
    const token = jwt.sign(payload, supersecret);

    // // Set token as HTTP-only cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: 8 * 60 * 60 * 1000, // 8 hours
    //   sameSite: "strict",
    // });

    // Return token and user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.send({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).send({ message: err.message });
  }
});

// // Logout
// router.post("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.send({ message: "Logout successful" });
// });

// Get current user info
router.get("/profile", userShouldBeLoggedIn, async (req, res) => {
  try {
    const result = await db(
      `SELECT id, username, isAdmin, student_id FROM users WHERE id = ${req.user_id}`
    );
    console.log(result, result);
    if (result.data.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    let userData = result.data[0];

    // If user is a student, add student info
    if (!userData.isAdmin && userData.student_id) {
      const studentResult = await db(
        `SELECT first_name, last_name FROM students WHERE id = ${userData.student_id}`
      );
      if (studentResult.data.length > 0) {
        userData = {
          ...userData,
          studentInfo: studentResult.data[0],
        };
      }
    }

    res.send(userData);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
