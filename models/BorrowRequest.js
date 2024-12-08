const mongoose = require('mongoose');

// Define BorrowRequest schema
const borrowRequestSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Pending' }, // Pending, Accepted, Denied
    createdAt: { type: Date, default: Date.now },
});

// Create BorrowRequest model
const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

module.exports = BorrowRequest;
