const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    condition: { type: String },
    image: { type: String }, // Path to the book image
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who owns the book
    isBorrowed: { type: Boolean, default: false }, // Borrow status
});

module.exports = mongoose.model('Book', bookSchema);
