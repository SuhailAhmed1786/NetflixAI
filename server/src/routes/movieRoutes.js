const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

const {
  listMovies,
  createMovie,
  getSceneAtTimestamp,
  createScene,
} = require("../controllers/movieController.js");

// Get all published movies
router.get("/", listMovies);

// Get scene at a specific timestamp
router.get("/:id/scene", getSceneAtTimestamp);

// Create a movie (authenticated users only)
router.post("/m", protect, createMovie);

// Add scene metadata (authenticated users only)
router.post("/:id/scenes", protect, createScene);

module.exports = router;