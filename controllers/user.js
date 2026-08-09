// ==========================================================
// Import User Model
// ==========================================================

const User = require("../models/user");

// ==========================================================
// Import bcrypt
// ==========================================================

const bcrypt = require("bcrypt");

// ==========================================================
// USER SIGNUP
// ==========================================================

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User created:", user._id);

    // After signup go to login
    return res.redirect("/user/login");

  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).send("Something went wrong");
  }
}

// ==========================================================
// USER LOGIN
// ==========================================================

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid email or password");
    }

    console.log("User logged in:", user.email);

    // For now redirect to home
    return res.redirect("/");

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).send("Something went wrong");
  }
}

// ==========================================================
// Export Controllers
// ==========================================================

module.exports = {
  handleUserSignup,
  handleUserLogin,
};