const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["customer", "worker", "admin"],
    required: true,
  },
  name: String,
  mobile: { type: String, required: true, unique: true },
  mobile_verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  profession: String,
  profile_image: String,
  experience: Number,
  location: {
    type: Object,
    required: false,
  },
  documents: [String],
  is_approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
