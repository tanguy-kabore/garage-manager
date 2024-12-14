import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createUser } from '../services/userService';
import './SignupForm.css';

const SignupForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification des mots de passe
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            password,
        };

        try {
            await createUser(userData);
            navigate('/login');
        } catch (error) {
            setError('Une erreur est survenue lors de la création de l\'utilisateur.');
            console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="signup-container">
                <h2>Inscription</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="Entrez le prénom"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            placeholder="Entrez le nom"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Entrez l'email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Entrez le mot de passe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/')}
                        >
                            Annuler
                        </button>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="submit-btn">S'inscrire</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignupForm;
