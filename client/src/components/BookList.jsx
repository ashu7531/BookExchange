import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddBookForm from './AddBookForm';  // Import the AddBookForm component

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        if (!token) {
            // If the user is not authenticated, redirect them to login
            window.location.href = '/';
            return;
        }

        // Fetch the books from the backend
        axios.get('http://localhost:5000/api/books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => setBooks(response.data))
            .catch((error) => console.error('Error fetching books:', error));
    }, [token]);

    // Function to handle the newly added book
    const handleBookAdded = (newBook) => {
        setBooks((prevBooks) => [newBook, ...prevBooks]);  // Add the new book to the list
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Available Books</h1>

            {/* Render the AddBookForm component */}
            <AddBookForm token={token} onBookAdded={handleBookAdded} />

            <ul style={styles.bookList}>
                {books.map((book, index) => (
                    <li key={index} style={styles.bookItem}>
                        <strong>{book.title}</strong> by {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f0f8ff',  // Light blue background
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#1e3a8a',  // Dark blue color
        marginBottom: '20px',
    },
    bookList: {
        listStyleType: 'none',
        padding: '0',
    },
    bookItem: {
        backgroundColor: '#ffffff',  // White background for each book item
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export default BookList;
