const User = require("../models/user.model");
const Athlete = require("../models/athlete.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER USER
// ==========================================

async function registerUser(req, res) {
    try {
        let { name, email, password, role } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // 2. Normalize input
        name = name.trim();
        email = email.trim().toLowerCase();

        // 3. Set default role
        role = role || "athlete";

        // 4. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // 7. Send response
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}


// ==========================================
// LOGIN USER
// ==========================================

async function loginUser(req, res) {
    try {
        let { email, password } = req.body;

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Normalize email
        email = email.trim().toLowerCase();

        // 3. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 5. Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // 6. Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}


// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Delete Account
async function deleteAccount(req,res){
  try{
    const userId = req.user.id;

    const user = await User.findByIdAndDelete(userId);

    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    return res.status(200).json({
      success:true,
      message:"Account deleted successfully"
    });
  }catch(error){
    console.error("Delete account error:",error);

    return res.status(500).json({
      success:false,
      message:"Error deleting account"
    });
  }
}

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Failed to change password"
    });
  }
};

const changeEmail = async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;

    if (!currentPassword || !newEmail) {
      return res.status(400).json({
        message: "Current password and new email are required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail === user.email) {
      return res.status(400).json({
        message: "New email must be different from current email"
      });
    }

    const emailExists = await User.findOne({
      email: normalizedEmail
    });

    if (emailExists) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    user.email = normalizedEmail;

    await user.save();

    res.status(200).json({
      message: "Email address changed successfully",
      email: user.email
    });
  } catch (error) {
    console.error("Change email error:", error);

    res.status(500).json({
      message: "Failed to change email address"
    });
  }
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    deleteAccount,
    changePassword,
    changeEmail
};