import React, { useState } from 'react';
import BookList from './BookList';
import AddBookForm from './AddBookForm';

const Homepage = ({ token }) => {


    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Welcome to the Book-Exchanger</h1>

            {/* Render the BookList */}
            <BookList token={token} />
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f5f5f5',
    },
    header: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    addBookButton: {
        display: 'block',
        margin: '10px auto',
        padding: '10px 15px',
        backgroundColor: '#1e3a8a',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    closeButton: {
        marginTop: '10px',
        backgroundColor: '#e53e3e',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Homepage;
