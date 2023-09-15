const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

// Create a middleware function to hash passwords
const hashPassword = async (req, res, next) => {
  try {
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.hashedPassword = hashedPassword; // Store the hashed password in the request object
      next(); // Continue to the next middleware or route handler
    } else {
      // Handle the case where no password is provided in the request body
      res.status(400).json({ error: 'Password is required' });
    }
  } catch (error) {
    // Handle any errors that occur during password hashing
    res.status(500).json({ error: 'Password hashing failed' });
  }
};

module.exports = hashPassword