// ==========================================================
// Import Required Packages
// ==========================================================

// Express Framework
const express = require("express");

// URL Model
const URL = require("./models/url");

// MongoDB connection function
const { connectToMongoDb } = require("./connect");

// URL routes
const urlRoute = require("./routes/url");

// ==========================================================
// Create Express Application
// ==========================================================

const app = express();

// Port number
const PORT = 8001;

// ==========================================================
// Middleware
// ==========================================================

// Allows Express to read JSON data from req.body
app.use(express.json());

// ==========================================================
// Connect to MongoDB
// ==========================================================

connectToMongoDb("mongodb://127.0.0.1:27017/shortURL")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// ==========================================================
// REDIRECT SHORT URL
// ==========================================================
//
// Example:
//
// http://localhost:8001/abc12345
//
// This will:
// 1. Find the short URL
// 2. Add visit timestamp
// 3. Redirect to original URL
//
// ==========================================================

app.get("/:shortId", async (req, res) => {
  try {
    // Get short ID from URL
    const shortId = req.params.shortId;

    // Find URL and update visit history
    const entry = await URL.findOneAndUpdate(
      {
        shortId: shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      {
        new: true,
      }
    );

    // ======================================================
    // Check if Short URL Exists
    // ======================================================

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    // ======================================================
    // Redirect User
    // ======================================================

    return res.redirect(entry.redirectURL);

  } catch (err) {
    console.log("Redirect error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// ==========================================================
// URL API ROUTES
// ==========================================================
//
// All routes inside routes/url.js will start with:
//
// /url
//
// Example:
//
// POST /url
//
// ==========================================================

app.use("/url", urlRoute);

// ==========================================================
// START SERVER
// ==========================================================

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});