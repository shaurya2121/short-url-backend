// ==========================================================
// Import Required Packages
// ==========================================================

const express = require("express");
const path = require("path");

// ==========================================================
// Import MongoDB Connection
// ==========================================================

const {
  connectToMongoDb,
} = require("./connect");

// ==========================================================
// Import Routes
// ==========================================================

// URL routes
const urlRoute = require("./routes/url");

// User authentication routes
const userRoute = require("./routes/user");

// ==========================================================
// Import URL Model
// ==========================================================

const URL = require("./models/url");

// ==========================================================
// Import Nanoid
// ==========================================================

const { nanoid } = require("nanoid");

// ==========================================================
// Create Express Application
// ==========================================================

const app = express();

// Port number
const PORT = 8001;

// ==========================================================
// MIDDLEWARE
// ==========================================================

// Parse JSON request body
//
// Used when data is sent as JSON:
//
// {
//   "url": "https://google.com"
// }

app.use(express.json());

// ==========================================================
// Parse HTML Form Data
// ==========================================================
//
// Required for EJS forms:
//
// <form method="POST">
//
// This allows us to access:
//
// req.body.name
// req.body.email
// req.body.password
// req.body.url
//

app.use(
  express.urlencoded({
    extended: false,
  })
);

// ==========================================================
// EJS CONFIGURATION
// ==========================================================

// Tell Express to use EJS as the template engine

app.set("view engine", "ejs");

// Tell Express where EJS files are located

app.set(
  "views",
  path.join(__dirname, "views")
);

// ==========================================================
// STATIC FILES
// ==========================================================
//
// CSS, images and frontend JavaScript
// will be inside the public folder.
//

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// ==========================================================
// CONNECT TO MONGODB
// ==========================================================

connectToMongoDb(
  "mongodb://127.0.0.1:27017/shortURL"
)
  .then(() => {
    console.log(
      "✅ MongoDB connected successfully"
    );
  })
  .catch((error) => {
    console.log(
      "❌ MongoDB connection error:",
      error
    );
  });

// ==========================================================
// USER ROUTES
// ==========================================================
//
// All user authentication routes start with:
//
// /user
//
// Example:
//
// POST /user
//
// This will call:
//
// handleUserSignup()
//

app.use("/user", userRoute);

// ==========================================================
// HOME PAGE
// ==========================================================
//
// GET /
//
// Displays home.ejs
//

app.get("/", (req, res) => {

  return res.render("home", {
    shortUrl: null,
    error: null,
  });

});

// ==========================================================
// CREATE SHORT URL
// ==========================================================
//
// POST /create
//
// This route receives the URL from the EJS form
// and creates a shortened URL.
//

app.post("/create", async (req, res) => {

  try {

    // Get URL from form

    const { url } = req.body;

    // ======================================================
    // Validate URL
    // ======================================================

    if (!url) {

      return res.status(400).render("home", {
        shortUrl: null,
        error: "Please enter a URL",
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

      shortId,

      redirectURL: url,

      visitHistory: [],

    });

    // ======================================================
    // Create Short URL
    // ======================================================

    const shortUrl =
      `http://localhost:${PORT}/${shortId}`;

    // ======================================================
    // Render Home Page
    // ======================================================

    return res.render("home", {

      shortUrl,

      error: null,

    });

  } catch (error) {

    console.log(
      "Create Short URL Error:",
      error
    );

    return res.status(500).render("home", {

      shortUrl: null,

      error:
        "Something went wrong. Please try again.",

    });

  }

});

// ==========================================================
// API ROUTES
// ==========================================================
//
// All URL API routes start with:
//
// /url
//
// Example:
//
// POST /url
//

app.use("/url", urlRoute);

// ==========================================================
// SHORT URL REDIRECT
// ==========================================================
//
// Example:
//
// http://localhost:8001/AbCd1234
//
// The server:
//
// 1. Finds the short URL
// 2. Records the visit
// 3. Redirects the user
//

app.get("/:shortId", async (req, res) => {

  try {

    // Get short ID from URL

    const shortId = req.params.shortId;

    // ======================================================
    // Find URL and Record Visit
    // ======================================================

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

    // ======================================================
    // Check If Short URL Exists
    // ======================================================

    if (!entry) {

      return res.status(404).send(
        "Short URL not found"
      );

    }

    // ======================================================
    // Redirect User
    // ======================================================

    return res.redirect(
      entry.redirectURL
    );

  } catch (error) {

    console.log(
      "Redirect Error:",
      error
    );

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
    `🚀 Server started at http://localhost:${PORT}`
  );

});