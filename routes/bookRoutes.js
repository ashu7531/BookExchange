const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
    try {
        console.log("Fetching books...");
        const books = await Book.find(); // Fetch all books
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    try {
        // Log req.body to confirm data is received
        console.log(req.body);

        // Destructure data from req.body
        const { title, author, genre, condition } = req.body;

        // Create and save the new book
        const newBook = new Book({ title, author, genre, condition });
        await newBook.save();

        // Respond with the saved book
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;


