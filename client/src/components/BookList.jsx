import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (!token) {
            // If the user is not authenticated, redirect them to login
            window.location.href = '/';
            return;
        }

        axios.get('http://localhost:5000/api/books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => setBooks(response.data))
            .catch((error) => console.error('Error fetching books:', error));
    }, [token]);

    return (
        <div>
            <h1>Available Books</h1>
            <ul>
                {books.map((book, index) => (
                    <li key={index}>
                        <strong>{book.title}</strong> by {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
