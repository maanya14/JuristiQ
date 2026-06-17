const mongoose = require("mongoose");

require("../db");

const feesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // User reference
  // Real link back to the case this fee record belongs to.
  case: { type: mongoose.Schema.Types.ObjectId, ref: "cases" },
  // Changed from String -> Number to match cases.js / client.js, so
  // findOne({ case_ref_no }) lookups actually match across collections.
  case_ref_no: { type: Number, required: true },
  clientName: { type: String, required: true },
  fees: { type: Number, required: true },
  amount_paid: { type: Number, required: true },
  pending_fees: { type: Number, required: true },
  payment_mode: { type: String, enum: ["Cash", "Card", "Online"], required: true },
  due_date: { type: Date, required: true },
  remarks: { type: String },
});



module.exports = mongoose.model('fees', feesSchema);