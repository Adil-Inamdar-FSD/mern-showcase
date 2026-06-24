const router = require("express").Router();
const { updateProfile, getMe } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");

router.put("/update-profile", auth, updateProfile);
router.get("/me",auth, getMe);

module.exports = router;
