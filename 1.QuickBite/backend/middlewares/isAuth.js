import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  console.log("Cookies:", req.cookies);
console.log("Authorization:", req.headers.authorization);
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};

export default isAuth;
