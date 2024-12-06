import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = ({ token, onBookAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        condition: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/books/', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                alert('Book added successfully!');
                onBookAdded(response.data);  // Notify the parent component to refresh the book list
                setFormData({
                    title: '',
                    author: '',
                    genre: '',
                    condition: ''
                });
            })
            .catch((error) => {
                console.error('Error adding book:', error);
                alert('Error adding book.');
            });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Add a New Book</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={formData.author}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        name="genre"
                        placeholder="Genre"
                        value={formData.genre}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        name="condition"
                        placeholder="Condition"
                        value={formData.condition}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Add Book</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f0f8ff', // Light blue background
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#1e3a8a', // Dark blue text color
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#1e3a8a', // Dark blue background for the button
        color: '#fff', // White text
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
};

export default AddBookForm;
