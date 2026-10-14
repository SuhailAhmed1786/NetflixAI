
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: true,
    },

    preferences: {
      genres: [{ type: String }],
      language: {
        type: String,
        default: "en",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);  
    