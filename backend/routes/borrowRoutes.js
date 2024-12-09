const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const Book = require('../models/Book');
const User = require('../models/User');

// Submit a borrow request
router.post('/', async (req, res) => {
    const { bookId, borrowerId } = req.body;

    try {
        console.log('Received bookId:', bookId);
        console.log('Received borrowerId:', borrowerId);

        // Check if bookId and borrowerId are valid ObjectId strings
        const bookObjectId = mongoose.Types.ObjectId.isValid(bookId) ? new mongoose.Types.ObjectId(bookId) : null;
        const borrowerObjectId = mongoose.Types.ObjectId.isValid(borrowerId) ? new mongoose.Types.ObjectId(borrowerId) : null;

        if (!bookObjectId || !borrowerObjectId) {
            return res.status(400).json({ error: 'Invalid ObjectId format for bookId or borrowerId' });
        }

        // Ensure the book exists
        const book = await Book.findById(bookObjectId);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        // Ensure the borrower exists
        const borrower = await User.findById(borrowerObjectId);
        if (!borrower) return res.status(404).json({ error: 'Borrower not found' });

        // Ensure the owner exists
        const owner = await User.findById(book.owner);
        if (!owner) return res.status(404).json({ error: 'Owner not found' });

        // Check if the book is already borrowed
        if (book.isBorrowed) {
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        // Create a new borrow request
        const borrowRequest = new BorrowRequest({
            book: bookObjectId,
            borrower: borrowerObjectId,
            owner: owner._id,
        });

        await borrowRequest.save();
        res.status(201).json(borrowRequest);
    } catch (error) {
        console.error('Error occurred during borrow request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Accept or Deny a borrow request
router.post('/respond', async (req, res) => {
    const { requestId, status } = req.body;

    try {
        // Find the borrow request by its ID
        const borrowRequest = await BorrowRequest.findById(requestId).populate('book borrower owner');
        if (!borrowRequest) return res.status(404).json({ error: 'Request not found' });

        // Update the borrow request status
        borrowRequest.status = status;

        if (status === 'Accepted') {
            // Mark the book as borrowed
            const book = await Book.findById(borrowRequest.book);
            book.isBorrowed = true;
            await book.save();

            // Add the book to the borrower's borrowedBooks list
            const borrower = await User.findById(borrowRequest.borrower);
            borrower.borrowedBooks.push(book._id);
            await borrower.save();

            // Remove the book from the owner's ownedBooks list
            const owner = await User.findById(borrowRequest.owner);
            owner.ownedBooks = owner.ownedBooks.filter(bookId => bookId.toString() !== book._id.toString());
            await owner.save();
        }

        await borrowRequest.save();
        res.status(200).json(borrowRequest);
    } catch (error) {
        console.error('Error occurred during borrow request response:', error);
        res.status(500).json({ error: error.message });
    }
});

// Fetch borrow requests for a user (borrower)
router.get('/my-requests/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const requests = await BorrowRequest.find({ borrower: userId }).populate('book owner');
        res.json(requests);
    } catch (error) {
        console.error('Error occurred fetching borrow requests:', error);
        res.status(500).json({ error: error.message });
    }
});

// Fetch borrow requests for a specific owner
router.get('/owner/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const requests = await BorrowRequest.find({ owner: userId })
            .populate('book borrower')
            .exec();
        res.json(requests);
    } catch (error) {
        console.error('Error fetching owner requests:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
