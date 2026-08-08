// ==========================================================
// Import Nanoid
// ==========================================================

const { nanoid } = require("nanoid");

// Import URL model
const URL = require("../models/url");

// ==========================================================
// CREATE SHORT URL
// ==========================================================

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    // Check URL
    if (!body.url) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    // Generate unique short ID
    const shortID = nanoid(8);

    // Create URL document
    const result = await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    // Return response
    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      id: result.shortId,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
}

// ==========================================================
// SHOW ANALYTICS PAGE
// ==========================================================

async function handleGetAnalytics(req, res) {

  try {

    const shortId = req.params.shortId;

    const entry = await URL.findOne({
      shortId,
    });

    // URL doesn't exist
    if (!entry) {
      return res.status(404).render("analytics", {
        error: "Short URL not found",
        entry: null,
      });
    }

    // Render EJS page
    return res.render("analytics", {
      entry,
      error: null,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).send("Server Error");
  }
}

// ==========================================================
// EXPORT CONTROLLERS
// ==========================================================

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};