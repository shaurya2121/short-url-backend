// ==========================================================
// Import Express
// ==========================================================

const express = require("express");

// Create router
const router = express.Router();

// ==========================================================
// Import Controllers
// ==========================================================

const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

// ==========================================================
// POST - CREATE SHORT URL
// ==========================================================

// POST /url
router.post("/", handleGenerateNewShortURL);

// ==========================================================
// GET - ANALYTICS PAGE
// ==========================================================

// GET /url/analytics/:shortId

router.get(
  "/analytics/:shortId",
  handleGetAnalytics
);

// ==========================================================
// Export Router
// ==========================================================

module.exports = router;