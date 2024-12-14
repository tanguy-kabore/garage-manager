import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login } from '../services/authService'; // Service d'authentification
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Appel du service d'authentification
      const { token, user } = await login(email, password);

      // Sauvegarde du token, de l'utilisateur et de son ID
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id); // Stockez l'ID de l'utilisateur

      // Redirection vers le tableau de bord
      navigate('/admin');
    } catch (err) {
      console.log('Erreur complète:', err);
      // Gestion des erreurs
      setError('Invalid credentials');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/signup'); // Redirige vers la page d'inscription
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Connexion</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="input-field"
          />
          <button type="submit" className="submit-btn">Se connecter</button>
        </form>
        <div className="register-redirect">
          <p>
            Vous n'avez pas encore de compte ?{' '}
            <span onClick={handleRegisterRedirect} className="register-link">Inscrivez-vous</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
