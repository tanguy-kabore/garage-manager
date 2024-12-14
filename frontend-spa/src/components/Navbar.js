import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const userId = localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">GarageManager</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Accueil</Link>
                <Link to="/login" className="nav-link">Connexion</Link>
                <Link to="/signup" className="nav-link">Inscription</Link>
                {userId && <Link to="/admin" className="nav-link">Admin</Link>}
            </div>
        </nav>
    );
};

export default Navbar;
