import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCar, faWrench, faBars } from '@fortawesome/free-solid-svg-icons';
import './Admin.css';

const Admin = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Fonction pour naviguer vers différentes pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Rediriger vers le profil de l'utilisateur connecté
  const handleProfileClick = () => {
    const userId = localStorage.getItem('userId'); // Récupère l'ID de l'utilisateur
    if (userId) {
      navigate(`/admin/user/${userId}`); // Redirige vers la page de vue utilisateur
    } else {
      alert("Utilisateur non connecté !");
    }
  };

  const handleHomeClick = () => {
    navigate(`/`);
  };

  // Déconnexion
  const handleLogout = () => {
    // Efface les données de session
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <div className={`navbar ${isCollapsed ? 'with-sidebar' : 'without-sidebar'}`}>
        <div className="navbar-content">
          <span className="navbar-logo" onClick={() => setIsCollapsed(!isCollapsed)}>
            <FontAwesomeIcon icon={faBars} className="icon" />
            Admin Dashboard
          </span>
          <div className="navbar-links">
          <button onClick={handleHomeClick}>Accueil</button>
            <button onClick={handleProfileClick}>Profil</button>
            <button onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'closed' : ''}`}>
        <ul className="menu">
          <li onClick={() => handleNavigation('/admin/user')}>
            <FontAwesomeIcon icon={faUsers} className="menu-icon" />
            {!isCollapsed && <span>Utilisateurs</span>}
          </li>
          <li onClick={() => handleNavigation('/admin/vehicule')}>
            <FontAwesomeIcon icon={faCar} className="menu-icon" />
            {!isCollapsed && <span>Véhicules</span>}
          </li>
          <li onClick={() => handleNavigation('/admin/maintenance')}>
            <FontAwesomeIcon icon={faWrench} className="menu-icon" />
            {!isCollapsed && <span>Maintenances</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`content ${isCollapsed ? 'without-sidebar' : 'with-sidebar'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
