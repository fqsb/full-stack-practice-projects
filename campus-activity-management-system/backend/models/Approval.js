const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['approved', 'rejected'], required: true },
  feedback: { type: String },
  approvalTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Approval', ApprovalSchema);