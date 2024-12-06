const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    condition: { type: String },
});

module.exports = mongoose.model('Book', bookSchema);
