import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBookForm from './AddBookForm';
import './BookList.css';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false); // To toggle AddBookForm visibility

    // Get user ID from token (JWT token payload decoding)
    const getUserIdFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decoding the token
        return payload.userId;
    };

    const userId = getUserIdFromToken(token); // Extract owner ID

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
            return;
        }

        axios
            .get('http://localhost:5000/api/books', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setBooks(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching books:', error);
                setIsLoading(false);
            });
    }, [token]);

    const handleBookAdded = (newBook) => {
        setBooks((prevBooks) => [newBook, ...prevBooks]);
        setIsFormVisible(false); // Hide form after book is added
    };

    const handleBorrowRequest = (bookId) => {
        axios
            .post(
                'http://localhost:5000/api/borrowrequests',
                {
                    bookId,
                    borrowerId: userId, // Include userId
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                alert('Borrow request sent!');
            })
            .catch((error) => {
                alert('Failed to send borrow request. Please try again.');
                console.error('Error sending borrow request:', error);
            });
    };

    if (isLoading) {
        return <div className="loading">Loading books...</div>;
    }

    return (
        <div className="book-list-container">
            <h1 className="book-list-header">Available Books</h1>
            <button className="add-book-button" onClick={() => setIsFormVisible(true)}>
                Add Book
            </button>
            {isFormVisible && (
                <div className="form-modal">
                    <div className="form-modal-content">
                        <button className="close-button" onClick={() => setIsFormVisible(false)}>
                            ×
                        </button>
                        <AddBookForm token={token} onBookAdded={handleBookAdded} ownerId={userId} />
                    </div>
                </div>
            )}
            {books.length === 0 ? (
                <p className="empty-state">No books available at the moment.</p>
            ) : (
                <div className="book-card-container">
                    {books.map((book, index) => (
                        <div key={index} className="book-card">
                            {book.image && (
                                <img
                                    src={`http://localhost:5000${book.image}`}
                                    alt={book.title}
                                    className="book-card-image"
                                />
                            )}
                            <div className="book-card-content">
                                <h2 className="book-card-title">{book.title}</h2>
                                <p className="book-card-author">by {book.author}</p>
                                <p className="book-card-genre">Genre: {book.genre || 'N/A'}</p>
                                <p className="book-card-condition">Condition: {book.condition || 'N/A'}</p>
                            </div>
                            <button
                                className="borrow-button"
                                onClick={() => handleBorrowRequest(book._id)}
                                disabled={book.isBorrowed}
                            >
                                {book.isBorrowed ? 'Already Borrowed' : 'Borrow'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookList;
