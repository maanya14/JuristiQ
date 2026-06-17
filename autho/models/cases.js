const mongoose = require('mongoose');
require("../db"); // Import the connection file

const casesSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  caseTitle: String,
  // Kept for quick display without populate, but it's now written FROM the
  // linked client record (see app.js) instead of being typed in separately.
  clientName: String,
  // Real link to the client record for this case.
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client"
  },
  // Real link to the fee record for this case.
  feeRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fees"
  },
  status: {
    type: String,
    enum: ['Closed', 'Active', 'Pending', 'won'] // Enum validation for status
  },
  nextHearing: Date,
  case_ref_no: {
    type: Number,
    required: true,
    unique: true // one case per reference number, enforced at the DB level
  },
  // Kept for quick display, but kept in sync with the linked fee record
  // by the /createcase and /updatecase routes rather than edited directly.
  fees: Number,
  pending_fees: Number,
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "post" }
  ]
});

module.exports = mongoose.model('cases', casesSchema);