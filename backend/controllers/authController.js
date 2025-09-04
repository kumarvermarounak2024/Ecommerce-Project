const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateOtp = () => {
  Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (email, otp) => {
  console.log(`OTP sent to ${email}: ${otp}`);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;
    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const userRole = role || "customer";
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
      mobile,
      role: role || "customer",
      otp,
      otpExpiry,
      isVerified: userRole === "customer",
    });

    await sendOtp(email, otp);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: user._id,
    });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Account verified successfully", userId: user._id });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login Successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout successfully" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOtp(email, otp);
    res.status(200).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.manageCustomer = async (req, res) => {
  try {
    const customers = await UserModel.find({ role: "customer" });

    const totalUsers = customers.length;
    const activeUsers = customers.filter(user => user.status === "active").length;
    const suspendedUsers = customers.filter(user => user.status === "suspended").length;

    res.status(200).json({
      success: true,
      totalUsers,
      activeUsers,
      suspendedUsers,
      customers,
    });
  } catch (err) {
    console.error("Error in manageCustomer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await UserModel.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error in getCustomerById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;
    const customer = await UserModel.findByIdAndUpdate(
      id,
      { name, email, mobile },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error("Error in updateCustomerById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await UserModel.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCustomerById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
