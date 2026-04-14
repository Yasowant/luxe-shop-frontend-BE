const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user", // ✅ default role
    });

    res.status(201).json({
      message: "User Registered ✅",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        msg: "Invalid Password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login SuccessFully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(401).json({ msg: "No token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ msg: "Invalid token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken(user);

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ msg: "Token expired" });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save();
    res.json({ msg: "Logged out Sucessfully" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      message: "Profile fetched ✅",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password -refreshToken");

    res.json({
      message: "Profile updated ✅",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json({
      message: "All Users Fetched",
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    res.json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 🔥 validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User role updated ✅",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
