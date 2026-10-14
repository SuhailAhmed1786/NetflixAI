
const mongoose = require("mongoose");

const sceneSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    startTime: {
      type: Number,
      required: true,
      min: 0,
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(value) {
          return value > this.startTime;
        },
        message: "endTime must be greater than startTime",
      },
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    characters: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

sceneSchema.index({ movie: 1, startTime: 1, endTime: 1 });
module.exports = mongoose.model("Scene", sceneSchema);
