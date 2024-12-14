import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByIdentifier } from '../../services/userService';
import './ViewUser.css';

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>Utilisateur non trouvé.</div>;
  }

  return (
    <div className="view-user-container">
      <h2>Détails de l'utilisateur</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="user-info-grid">
        <div className="user-info-item">
          <strong>Prénom :</strong> {user.firstName}
        </div>
        <div className="user-info-item">
          <strong>Nom :</strong> {user.lastName}
        </div>
        <div className="user-info-item">
          <strong>Email :</strong> {user.email}
        </div>
        <div className="user-info-item">
          <strong>Rôle :</strong> {user.role}
        </div>
        <div className="user-info-item">
          <strong>Créé le :</strong> {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div className="user-info-item">
          <strong>Mis à jour le :</strong> {new Date(user.updatedAt).toLocaleDateString()}
        </div>
        <button onClick={() => navigate('/admin/user')} className="back-btn">
          Retour
        </button>
        <button onClick={() => navigate(`/admin/user/edit/${id}`)} className="edit-btn">
          Modifier
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
