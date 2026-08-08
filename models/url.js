// ==========================================================
// Import Mongoose
// ==========================================================

const mongoose = require("mongoose");

// ==========================================================
// URL Schema
// ==========================================================

const urlSchema = new mongoose.Schema(
  {
    // Unique short ID
    shortId: {
      type: String,
      required: true,
      unique: true,
    },

    // Original URL
    redirectURL: {
      type: String,
      required: true,
    },

    // Store every visit
    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },

  // Automatically creates createdAt and updatedAt
  {
    timestamps: true,
  }
);

// ==========================================================
// Create Model
// ==========================================================

const URL = mongoose.model("URL", urlSchema);

// ==========================================================
// Export Model
// ==========================================================

module.exports = URL;