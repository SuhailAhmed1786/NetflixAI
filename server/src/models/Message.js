const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WatchParty",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Message cannot be empty"],
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ["TEXT", "SYSTEM"],
      default: "TEXT",
    },
  },
  { timestamps: true }
);

messageSchema.index({ party: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
