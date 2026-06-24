const User = require("../model/userModel");

// GET current user
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        ...user._doc,
        joined: user.createdAt, // 👈 ADD THIS
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// UPDATE profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.username && { username: req.body.username }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.phone && { phone: req.body.phone }),
        ...(req.body.address && { address: req.body.address }),
        ...(req.body.image && { image: req.body.image }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMe, updateProfile };
