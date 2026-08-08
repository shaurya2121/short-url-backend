// ==========================================================
// Import Required Packages
// ==========================================================

const express = require("express");
const path = require("path");

// MongoDB connection
const {
  connectToMongoDb,
} = require("./connect");

// URL routes
const urlRoute = require("./routes/url");

// URL model
const URL = require("./models/url");

// ==========================================================
// Create Express Application
// ==========================================================

const app = express();

// Port
const PORT = 8001;

// ==========================================================
// Middleware
// ==========================================================

// Parse JSON
app.use(express.json());

// Parse HTML form data
app.use(express.urlencoded({ extended: false }));

// ==========================================================
// EJS Configuration
// ==========================================================

// Tell Express that we are using EJS
app.set("view engine", "ejs");

// Tell Express where the views folder is
app.set(
  "views",
  path.join(__dirname, "views")
);

// ==========================================================
// Static Files
// ==========================================================

// CSS, images, JavaScript etc.
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// ==========================================================
// MongoDB Connection
// ==========================================================

connectToMongoDb(
  "mongodb://127.0.0.1:27017/shortURL"
)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );
  })
  .catch((error) => {
    console.log(
      "MongoDB connection error:",
      error
    );
  });

// ==========================================================
// HOME PAGE
// ==========================================================

// GET /

// EJS renders home.ejs on the server

app.get("/", (req, res) => {

  res.render("home", {
    shortUrl: null,
    error: null,
  });

});

// ==========================================================
// CREATE SHORT URL FROM EJS FORM
// ==========================================================

app.post("/create", async (req, res) => {

  try {

    const { url } = req.body;

    // Validate URL
    if (!url) {

      return res.render("home", {
        shortUrl: null,
        error: "Please enter a URL",
      });

    }

    // Generate short ID
    const { nanoid } = require("nanoid");

    const shortId = nanoid(8);

    // Save in MongoDB
    await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
    });

    // Generate short URL
    const shortUrl =
      `http://localhost:${PORT}/${shortId}`;

    // Render home page again
    return res.render("home", {
      shortUrl,
      error: null,
    });

  } catch (error) {

    console.log(error);

    return res.render("home", {
      shortUrl: null,
      error: "Something went wrong",
    });

  }

});

// ==========================================================
// API ROUTES
// ==========================================================

app.use("/url", urlRoute);

// ==========================================================
// SHORT URL REDIRECT
// ==========================================================

// Example:
//
// http://localhost:8001/AbCd1234
//
// This redirects to the original URL.

app.get("/:shortId", async (req, res) => {

  try {

    const shortId = req.params.shortId;

    // Find URL and record visit
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
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

    // Short URL doesn't exist
    if (!entry) {
      return res.status(404).send(
        "Short URL not found"
      );
    }

    // Redirect
    return res.redirect(
      entry.redirectURL
    );

  } catch (error) {

    console.log(error);

    return res.status(500).send(
      "Server Error"
    );

  }

});

// ==========================================================
// START SERVER
// ==========================================================

app.listen(PORT, () => {

  console.log(
    `Server started at http://localhost:${PORT}`
  );

});