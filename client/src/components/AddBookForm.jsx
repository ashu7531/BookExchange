import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = ({ token, onBookAdded, ownerId }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        condition: '',
        image: null, // Initialize the image field as null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0], // Store the uploaded file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('genre', formData.genre);
        data.append('condition', formData.condition);
        data.append('image', formData.image); // Append the image file
        if (ownerId) {
            data.append('owner', ownerId); // Append the owner ID if provided
        }

        try {
            const response = await axios.post('https://bookexchange-q7kq.onrender.com/api/books/', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set the content type for file uploads
                },
            });
            alert('Book added successfully!');
            onBookAdded(response.data); // Notify the parent component
            setFormData({
                title: '',
                author: '',
                genre: '',
                condition: '',
                image: null,
            });
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Error adding book.');
        }
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
                        required
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
                        required
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
                <div style={styles.inputContainer}>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        style={styles.input}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Add Book
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f0f8ff',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#1e3a8a',
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
        backgroundColor: '#1e3a8a',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
};

export default AddBookForm;
