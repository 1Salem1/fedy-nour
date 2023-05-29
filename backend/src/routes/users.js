const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { auth, adminAuth } = require("../middleware/auth");

// Get All users (admin only)
router.get("/", adminAuth, (req, res) => {
  User.find().exec((err, users) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).json(users);
  });
});

// Get User Profile
router.get("/profile", (req, res) => {
  User.findById(req.user.user).exec((err, user) => {
    if (err) return res.status(500).send(err.message);
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  });
});

// Update User Profile
router.put("/profile",  async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.user,
      { name, email },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to update profile" });
  }
});

// Create a User (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ status: false, message: "Account Taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(200).json({ status: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to create user" });
  }
});

// Update User (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to update user" });
  }
});

// Delete User (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to delete user" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res.status(401).json({ status: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your-secret-key", { expiresIn: "1h" });

    res.status(200).json({ status: true, token });
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to login" });
  }
});

// User Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({ status: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ status: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error, Unable to register user" });
  }
});

module.exports = router;
