const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ==============================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ==============================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, cgpa } = req.body;

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //  Create user (password hashing handled in model)
    const user = await User.create({
      name,
      email,
      password,
      role,
      cgpa,
    });

    //  Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ==============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (include password explicitly)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //  Compare password using model method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================
// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
// =======================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("assignedTopic", "title");

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
