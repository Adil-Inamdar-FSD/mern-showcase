const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, username, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json(user);
  } catch (err) {
    console.log("REGISTER ERROR:", err);

    return res.status(400).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "aldfjflglglskfsjl",
      { expiresIn: "7d" },
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { login, register };
