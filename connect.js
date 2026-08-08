// ==========================================================
// Import Mongoose
// ==========================================================

const mongoose = require("mongoose");

// ==========================================================
// MongoDB Connection Function
// ==========================================================

async function connectToMongoDb(url) {
  return mongoose.connect(url);
}

// ==========================================================
// Export Function
// ==========================================================

module.exports = {
  connectToMongoDb,
};