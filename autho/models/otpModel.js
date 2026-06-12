const mongoose = require("mongoose");
require("../db"); // Import the connection file

const otpSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 5 minutes
});

module.exports = mongoose.model("otp", otpSchema);
