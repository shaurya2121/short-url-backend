// ==========================================================
// Import Mongoose
// ==========================================================

const mongoose = require("mongoose");

// ==========================================================
// Create URL Schema
// ==========================================================

const urlSchema = new mongoose.Schema(
  {
    // ======================================================
    // Short ID
    // ======================================================
    // This is the unique ID generated for the shortened URL.
    //
    // Example:
    // abc12345
    // ======================================================

    shortId: {
      type: String,
      required: true,
      unique: true,
    },

    // ======================================================
    // Original URL
    // ======================================================
    // This stores the actual URL where the user
    // should be redirected.
    //
    // Example:
    // https://www.google.com
    // ======================================================

    redirectURL: {
      type: String,
      required: true,
    },

    // ======================================================
    // Visit History
    // ======================================================
    // Every time somebody uses the short URL,
    // we store the timestamp of that visit.
    //
    // Example:
    //
    // visitHistory: [
    //   { timestamp: 1754638200000 },
    //   { timestamp: 1754638300000 }
    // ]
    // ======================================================

    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },

  // ========================================================
  // Automatically creates:
  //
  // createdAt
  // updatedAt
  // ========================================================

  {
    timestamps: true,
  }
);

// ==========================================================
// Create MongoDB Model
// ==========================================================

const URL = mongoose.model("url", urlSchema);

// ==========================================================
// Export Model
// ==========================================================

module.exports = URL;