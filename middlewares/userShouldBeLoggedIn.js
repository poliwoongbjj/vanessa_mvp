var jwt = require("jsonwebtoken");
const supersecret = process.env.SUPER_SECRET;

const userShouldBeLoggedIn = (req, res, next) => {
  console.log("THIS IS THE AUTH MIDDLWARE");

  // Get token from Authorization header
  const token = req.headers.authorization?.replace(/^Bearer\s/, "");

  if (!token) {
    res.status(401).send({ message: "Please provide a token" });
    return;
  } else {
    // Verify the token
    jwt.verify(token, supersecret, function (err, decoded) {
      if (err) {
        return res.status(401).send({ message: err.message });
      }

      // Add user info to request object
      req.user_id = decoded.user_id;
      req.isAdmin = decoded.isAdmin;
      req.username = decoded.username;

      // If user is a student, add their student_id
      if (!decoded.isAdmin && decoded.student_id) {
        req.student_id = decoded.student_id;
      }

      next();
    });
  }
};

// Middleware to check if user is an admin
const userShouldBeAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).send({ message: "Admin access required" });
  }

  next();
};

// Middleware to check if user is accessing their own student data
const userAccessOwnStudentData = (req, res, next) => {
  // Admin can access any student data
  if (req.isAdmin) {
    return next();
  }

  // Student can only access their own data
  const requestedStudentId = parseInt(req.params.id);

  if (req.student_id !== requestedStudentId) {
    return res
      .status(403)
      .send({ message: "You can only access your own data" });
  }

  next();
};

module.exports = {
  userShouldBeLoggedIn,
  userShouldBeAdmin,
  userAccessOwnStudentData,
};
