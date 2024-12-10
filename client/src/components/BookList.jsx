import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddBookForm from './AddBookForm';
import './BookList.css';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [requests, setRequests] = useState([]); // Store requests
    const [isLoading, setIsLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isRequestModalVisible, setIsRequestModalVisible] = useState(false); // Toggle requests modal

    const navigate = useNavigate();

    const getUserIdFromToken = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    };

    const userId = getUserIdFromToken(token);

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
            return;
        }

        // Fetch books
        axios
            .get('https://bookexchange-q7kq.onrender.com/api/books', {
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
        setIsFormVisible(false);
    };

    const handleBorrowRequest = (bookId) => {
        axios
            .post(
                'https://bookexchange-q7kq.onrender.com/api/borrowrequests',
                { bookId, borrowerId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                alert('Borrow request sent!');
            })
            .catch((error) => {
                alert('Failed to send borrow request. Please try again.');
                console.error('Error sending borrow request:', error);
            });
    };

    const fetchBorrowRequests = () => {
        axios
            .get(`https://bookexchange-q7kq.onrender.com/api/borrowrequests/owner/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                // Filter out requests with "Accepted" or "Denied" status
                const pendingRequests = response.data.filter(
                    (request) => request.status !== 'Accepted' && request.status !== 'Denied'
                );
                setRequests(pendingRequests);
                setIsRequestModalVisible(true);
            })
            .catch((error) => {
                console.error('Error fetching requests:', error);
            });
    };

    const respondToRequest = (requestId, status) => {
        axios
            .post(
                'https://bookexchange-q7kq.onrender.com/api/borrowrequests/respond',
                { requestId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                alert(`Request ${status.toLowerCase()} successfully!`);
                setRequests((prev) =>
                    prev.filter((request) => request._id !== requestId)
                );
            })
            .catch((error) => {
                alert('Failed to respond to request. Please try again.');
                console.error('Error responding to request:', error);
            });
    };

    if (isLoading) {
        return <div className="loading">Loading books...</div>;
    }

    return (
        <div className="book-list-container">
            <div className="button-group">
                <button className="add-book-button" onClick={() => setIsFormVisible(true)}>
                    Add Book
                </button>
                <button className="view-requests-button" onClick={fetchBorrowRequests}>
                    View Requests
                </button>
            </div>
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
            {isRequestModalVisible && (
                <div className="form-modal">
                    <div className="form-modal-content">
                        <button className="close-button" onClick={() => setIsRequestModalVisible(false)}>
                            ×
                        </button>
                        <h2>Borrow Requests</h2>
                        {requests.length === 0 ? (
                            <p>No requests available</p>
                        ) : (
                            requests.map((request) => (
                                <div key={request._id} className="request-card">
                                    <p><strong>Book:</strong> {request.book.title}</p>
                                    <p><strong>Borrower:</strong> {request.borrower.name}</p>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    <button
                                        className="accept-button"
                                        onClick={() => respondToRequest(request._id, 'Accepted')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="deny-button"
                                        onClick={() => respondToRequest(request._id, 'Denied')}
                                    >
                                        Deny
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {books.length === 0 ? (
                <p className="empty-state">No books available at the moment.</p>
            ) : (
                <div className="book-card-container">
                    {books.map((book, index) => (
                        <div key={index} className="book-card">
                            {console.log('Book ownerId:', book.ownerId, 'User ID:', userId)} {/* Add this line */}

                            {book.image && (
                                <img
                                    src={`https://bookexchange-q7kq.onrender.com${book.image}`}
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
                            {/* Only show the Borrow button if the owner ID is not the same as the current user ID */}
                            {console.log('Comparing:', book.owner?.toString(), 'with', userId?.toString())} {/* Add this for comparison */}
                            {book.owner?.toString() !== userId?.toString() && (
                                <button
                                    className="borrow-button"
                                    onClick={() => handleBorrowRequest(book._id)}
                                    disabled={book.isBorrowed}
                                >
                                    {book.isBorrowed ? 'Already Borrowed' : 'Borrow'}
                                </button>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default BookList;
