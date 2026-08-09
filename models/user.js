// ==========================================================
// Import Mongoose
// ==========================================================

const mongoose = require("mongoose");

// ==========================================================
// Create User Schema
// ==========================================================

const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User email
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },
  },

  {
    // Automatically creates createdAt and updatedAt
    timestamps: true,
  }
);

// ==========================================================
// Create User Model
// ==========================================================

const User = mongoose.model("User", userSchema);

// ==========================================================
// Export User Model
// ==========================================================

module.exports = User;