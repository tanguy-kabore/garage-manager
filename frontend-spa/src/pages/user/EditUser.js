import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByIdentifier, updateUser } from '../../services/userService';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [resetPassword, setResetPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByIdentifier(id);
        if (response) {
          setUser(response);
        } else {
          setError('Utilisateur introuvable');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        setError('Erreur de récupération de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetPassword && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const updatedUser = { ...user };
      if (resetPassword) {
        updatedUser.password = password;
      }

      await updateUser(id, updatedUser);
      alert('Utilisateur mis à jour avec succès.');
      navigate('/admin/user');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
      setError('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-user-container">
      <h2>Modifier l'utilisateur</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-user-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            >
              <option value="client">Client</option>
              <option value="mecanicien">Mécanicien</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="resetPassword"
              checked={resetPassword}
              onChange={() => setResetPassword(!resetPassword)}
            />
            Réinitialiser le mot de passe
          </label>
        </div>

        {resetPassword && (
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              />
            </div>
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/admin/user')}
            >
              Retour
            </button>
          </div>
          <div className="form-group">
            <button type="submit" className="save-btn">Enregistrer</button>
          </div>

        </div>
      </form>
    </div>

  );
};

export default EditUser;
