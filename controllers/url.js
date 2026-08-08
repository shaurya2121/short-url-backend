// ==========================================================
// Import Required Packages
// ==========================================================

// nanoid is used to generate a unique short ID
const { nanoid } = require("nanoid");

// Import URL Model
const URL = require("../models/url");

// ==========================================================
// CREATE SHORT URL
// ==========================================================
// Method : POST
// URL    : /url
//
// Request Body:
// {
//   "url": "https://www.google.com"
// }
//
// Response:
// {
//   "id": "aB12xYz9"
// }
// ==========================================================

async function handleGenerateNewShortURL(req, res) {
  try {
    // Get data from request body
    const body = req.body;

    // ======================================================
    // Validate URL
    // ======================================================

    if (!body.url) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    // ======================================================
    // Generate Short ID
    // ======================================================

    const shortId = nanoid(8);

    // ======================================================
    // Save URL in MongoDB
    // ======================================================

    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    // ======================================================
    // Send Response
    // ======================================================

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      id: shortId,
    });

  } catch (err) {
    // ======================================================
    // Handle Errors
    // ======================================================

    console.log("Error creating short URL:", err);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}

// ==========================================================
// Export Controller
// ==========================================================

module.exports = {
  handleGenerateNewShortURL,
};