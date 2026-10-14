
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 3000,
    },
    genre: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Movie", movieSchema);
