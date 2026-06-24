const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // 🔥 THIS IS REQUIRED

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;