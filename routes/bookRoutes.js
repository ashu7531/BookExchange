const express = require('express');
const multer = require('multer');
const router = express.Router();
const Book = require('../models/Book');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static('uploads'));

// Get all books
router.get('/', async (req, res) => {
    try {
        console.log("Fetching books...");
        const books = await Book.find().populate('owner', 'name email'); // Populate owner details (optional)
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new book with an optional image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Log the request data
        console.log(req.body);
        console.log(req.file);

        // Destructure data from req.body
        const { title, author, genre, condition, owner } = req.body; // Include 'owner'

        // Validate that 'owner' is provided
        if (!owner) {
            return res.status(400).json({ error: "Owner field is required" });
        }

        // Get image path if uploaded
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        // Create and save the new book
        const newBook = new Book({ title, author, genre, condition, image, owner });
        await newBook.save();

        // Respond with the saved book
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('owner', 'name email'); // Populate owner details (optional)
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a book by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
