import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BookList from './BookList';
import Cart from './Cart';
import './HomePage.css'; // Import the external CSS file

const Homepage = ({ token }) => {
    return (
        <div className="homepage-container">
            <h1 className="homepage-header">Welcome to the Book-Exchanger</h1>

            {/* Navigation Links */}
            <nav className="homepage-nav">
                <Link to="/booklist" className="homepage-nav-link">Book List</Link>
                <Link to="/cart" className="homepage-nav-link">Cart</Link>
            </nav>

            {/* Define Routes */}
            <Routes>
                <Route index element={<BookList token={token} />} /> {/* Default Route */}
                <Route path="/booklist" element={<BookList token={token} />} />
                <Route path="/cart" element={<Cart token={token} />} />
            </Routes>
        </div>
    );
};

export default Homepage;
