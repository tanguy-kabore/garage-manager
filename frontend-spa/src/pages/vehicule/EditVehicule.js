import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getUsers } from "../../services/userService"; // Service pour récupérer la liste des utilisateurs
import { getVehicleById, updateVehicle } from "../../services/vehicleService";
import "./EditVehicule.css";

const EditVehicule = () => {
  const [vehicule, setVehicule] = useState({
    marque: "",
    modele: "",
    annee: "",
    num_immatriculation: "",
    kilometrage: "",
    proprietaire_id: "", // Nouveau champ pour le propriétaire
  });
  const [users, setUsers] = useState([]); // Liste des utilisateurs (propriétaires)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Récupère l'ID du véhicule à partir de l'URL
  const navigate = useNavigate();

  // Charger les données du véhicule et la liste des utilisateurs (propriétaires)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données du véhicule
        const vehiculeData = await getVehicleById(id);
        setVehicule(vehiculeData);

        // Récupérer la liste des utilisateurs (propriétaires)
        const usersData = await getUsers(); // Appel à l'API pour récupérer les utilisateurs
        setUsers(usersData);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setError("Impossible de charger les détails du véhicule ou les utilisateurs.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Gérer la modification du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicule((prevVehicule) => ({
      ...prevVehicule,
      [name]: value,
    }));
  };

  // Gérer la modification du propriétaire via la liste déroulante
  const handleOwnerChange = (selectedOption) => {
    setVehicule((prevVehicule) => ({
      ...prevVehicule,
      proprietaire_id: selectedOption ? selectedOption.value : "", // On met à jour l'ID du propriétaire
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVehicle(id, vehicule); // Appel au service pour mettre à jour le véhicule
      alert("Véhicule mis à jour avec succès.");
      navigate("/vehicule"); // Redirection vers la liste des véhicules après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du véhicule :", error);
      setError("Erreur lors de la mise à jour du véhicule.");
    }
  };

  // Afficher un message de chargement ou d'erreur
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Mapper les utilisateurs pour react-select
  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`, // Afficher le prénom et le nom
  }));

  return (
    <div className="edit-vehicule-container">
      <h2>Modifier le véhicule</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="edit-vehicule-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Marque</label>
            <input
              type="text"
              name="marque"
              value={vehicule.marque}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Modèle</label>
            <input
              type="text"
              name="modele"
              value={vehicule.modele}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Année</label>
            <input
              type="number"
              name="annee"
              value={vehicule.annee}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Immatriculation</label>
            <input
              type="text"
              name="num_immatriculation"
              value={vehicule.num_immatriculation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Kilométrage</label>
            <input
              type="number"
              name="kilometrage"
              value={vehicule.kilometrage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Propriétaire</label>
            <Select
              name="proprietaire_id"
              value={userOptions.find((option) => option.value === vehicule.proprietaire_id)}
              onChange={handleOwnerChange}
              options={userOptions}
              isSearchable
              placeholder="Sélectionner un propriétaire"
            />
          </div>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin/vehicule')}
          >
            Retour
          </button>
          <button type="submit" className="submit-btn">Modifier</button>
        </div>
      </form>

    </div>
  );
};

export default EditVehicule;
