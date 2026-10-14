const mongoose = require("mongoose");

const watchPartySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
      index: true,
    },
    playbackState: {
      isPlaying: {
        type: Boolean,
        default: false,
      },
      currentTime: {
        type: Number,
        default: 0,
        min: 0,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchParty", watchPartySchema);


