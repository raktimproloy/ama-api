const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const router = express.Router()
const ParentsUser = require("../../models/userSchema/parentsUserSchema")
const hashPassword = require("../../middleware/hashPassword")


// post api for parent signup
router.post("/signup", hashPassword, async (req, res) => {
    try {
      const { userType, email, password, fullName, phone, studentId, address } = req.body;
  
      // Input validation
      if (userType !== "parent" || !email || !password) {
        return res.status(400).json({ error: "Invalid requirement" });
      }
  
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email!" });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ error: "Invalid Password! Password must be at least 8 characters long." });
      }
  
      // Check if email is already used
      const existingUser = await ParentsUser.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "Email already used" });
      }
  
      // Hashed password is available in req.hashedPassword due to the middleware
      const hashedPassword = req.hashedPassword;
  
      // Create a new user
      const newUserData = {
        fullName,
        phone,
        studentId,
        email,
        userType: "Parent", 
        address,
        password: hashedPassword,
      };
  
      const newParentsUser = new ParentsUser(newUserData);
      await newParentsUser.save();
  
      res.status(200).json({ message: "Signup Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "There was a server-side problem!" });
    }
  });


  router.post("/login", async (req, res) => {
    try {
      // Validate user input
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required." });
      }
  
      // Check if a user with the given email exists
      const user = await ParentsUser.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      // Compare the provided password with the hashed password in the database
      const isValidPassword = await bcrypt.compare(password, user.password);
  
      if (!isValidPassword) {
        return res.status(401).json({ error: "Password not matched" });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          userFullName: user.fullName,
          email: user.email,
        },
        process.env.JWT_SECRET, // Use your securely stored JWT secret here
        {
          expiresIn: "1h",
        }
      );
  
      // Respond with success
      res.status(200).json({ token, message: "Login Successful" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports = router