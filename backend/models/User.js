const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ownedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Books this user owns
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }], // Books this user borrowed
});

module.exports = mongoose.model('User', userSchema);
