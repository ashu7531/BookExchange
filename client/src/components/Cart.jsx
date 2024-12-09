import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = ({ token }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

        const fetchCartItems = async () => {
            try {
                const ownedBooksResponse = await axios.get('http://localhost:5000/api/books', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ownedBooks = ownedBooksResponse.data.filter((book) => book.owner === userId);

                const borrowRequestsResponse = await axios.get(
                    `http://localhost:5000/api/borrowrequests/my-requests/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const borrowedBooks = borrowRequestsResponse.data
                    .filter((request) => request.status === 'Accepted')
                    .map((request) => request.book);

                setCartItems([...ownedBooks, ...borrowedBooks]);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setIsLoading(false);
            }
        };

        fetchCartItems();
    }, [token, userId]);

    if (isLoading) {
        return <div className="loading">Loading your cart...</div>;
    }

    return (
        <div className="cart-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((book, index) => (
                        <div key={index} className="cart-item">
                            {book.image && (
                                <img
                                    src={`http://localhost:5000${book.image}`}
                                    alt={book.title}
                                    className="cart-item-image"
                                />
                            )}
                            <div className="cart-item-details">
                                <h2>{book.title}</h2>
                                <p>Author: {book.author}</p>
                                <p>Condition: {book.condition || 'N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
