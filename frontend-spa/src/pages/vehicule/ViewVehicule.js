import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByIdentifier } from "../../services/userService"; // Service pour récupérer un utilisateur par ID
import { getVehicleById } from "../../services/vehicleService"; // Service pour récupérer un véhicule
import "./ViewVehicule.css";

const ViewVehicule = () => {
  const { id } = useParams(); // Utilisation de useParams pour obtenir l'id du véhicule dans l'URL
  const [vehicle, setVehicle] = useState(null); // État pour stocker les données du véhicule
  const [owner, setOwner] = useState(null); // État pour stocker les données du propriétaire
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const navigate = useNavigate();

  // Récupérer les détails du véhicule et du propriétaire lors du chargement de la page
  useEffect(() => {
    const fetchVehicleAndOwner = async () => {
      try {
        // Récupérer les données du véhicule
        const vehicleData = await getVehicleById(id);
        setVehicle(vehicleData);

        // Récupérer les informations du propriétaire si elles sont disponibles
        const ownerData = await getUserByIdentifier(vehicleData.proprietaire_id);
        setOwner(ownerData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError("Impossible de récupérer les détails du véhicule ou du propriétaire.");
      }
    };

    fetchVehicleAndOwner();
  }, [id]);

  const handleGoBack = () => {
    navigate("/admin/vehicule"); // Rediriger vers la liste des véhicules
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!vehicle || !owner) {
    return <div>Chargement des détails du véhicule...</div>;
  }

  return (
    <div className="view-vehicule-container">
      <h2>Détails du véhicule</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="details-grid">
        <div className="form-group">
          <label>Marque</label>
          <p>{vehicle.marque}</p>
        </div>

        <div className="form-group">
          <label>Modèle</label>
          <p>{vehicle.modele}</p>
        </div>

        <div className="form-group">
          <label>Année</label>
          <p>{vehicle.annee}</p>
        </div>

        <div className="form-group">
          <label>Immatriculation</label>
          <p>{vehicle.num_immatriculation}</p>
        </div>

        <div className="form-group">
          <label>Kilométrage</label>
          <p>{vehicle.kilometrage}</p>
        </div>

        <div className="form-group">
          <label>Propriétaire</label>
          <p>{`${owner.firstName} ${owner.lastName}`}</p>
        </div>
        <button onClick={handleGoBack} className="go-back-btn">Retour</button>
        <button onClick={() => navigate(`/admin/vehicule/edit/${id}`)} className="edit-btn">
          Modifier
        </button>
      </div>
    </div>

  );
};

export default ViewVehicule;
