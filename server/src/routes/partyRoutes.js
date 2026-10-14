const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const {
  createParty,
  joinParty,
  getParty,
  leaveParty,
  getPartyMessages,
} = require("../controllers/partyController.js");

// Create a new watch party
router.post("/", protect, createParty);

// Join a party using its code
router.post("/join/:code", protect, joinParty);

// Get messages for a specific party
router.get("/:id/messages", protect, getPartyMessages);

// Get party details
router.get("/:id", protect, getParty);

// Leave a party
router.post("/:id/leave", protect, leaveParty);

module.exports = router;