const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { fullName, userId, userType, email, exp } = decoded;

        // Get the current timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);
        
        // Check if the token has expired
        if (exp && exp > currentTimestamp) {
            req.fullName = fullName;
            req.userId = userId;
            req.userType = userType;
            req.email = email;
            next();
        } else {
            console.log("False expire")
            // Token has expired
            next("Authentication failure: Token has expired.");
        }
    } catch (error) {
        console.log("error")
        // Handle token verification error
        next("Authentication failure: Invalid token.");
    }
};

module.exports = checkToken;
