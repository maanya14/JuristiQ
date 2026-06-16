const mongoose = require('mongoose');
require("../db"); // Import the connection file
const casesSchema= mongoose.Schema({
  caseTitle: String,
    clientName: String,
    status: {
      type: String,
      enum: ['Closed', 'Active', 'Pending','won'] // Enum validation for status
      // Optionally, you can make status a required field
    },
    nextHearing: Date,
    case_ref_no: Number,
    fees: Number,
    pending_fees: Number,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "post"}
    ]
});
module.exports= mongoose.model('cases', casesSchema);
