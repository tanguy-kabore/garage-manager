import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getUsers } from "../../services/userService";
import { createVehicle } from "../../services/vehicleService";
import "./CreateVehicule.css";

const CreateVehicule = () => {
  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    annee: "",
    num_immatriculation: "",
    kilometrage: "",
    proprietaire_id: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Génération des années
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const usersList = usersData.map(user => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setError("Erreur lors de la récupération des utilisateurs.");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      proprietaire_id: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.marque ||
      !formData.modele ||
      !formData.annee ||
      !formData.num_immatriculation ||
      !formData.kilometrage ||
      !formData.proprietaire_id
    ) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    try {
      await createVehicle(formData);
      alert("Véhicule créé avec succès!");
      navigate("/admin/vehicule");
    } catch (error) {
      console.error("Erreur lors de la création du véhicule:", error);
      setError("Erreur lors de la création du véhicule.");
    }
  };

  return (
    <div className="create-vehicule-container">
      <h2>Créer un véhicule</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-vehicule-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="marque">Marque</label>
            <input
              type="text"
              id="marque"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              placeholder="Entrez la marque"
            />
          </div>
          <div className="form-group">
            <label htmlFor="modele">Modèle</label>
            <input
              type="text"
              id="modele"
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              placeholder="Entrez le modèle"
            />
          </div>
          <div className="form-group">
            <label htmlFor="annee">Année</label>
            <select
              id="annee"
              name="annee"
              value={formData.annee}
              onChange={handleChange}
            >
              <option value="">Choisissez une année</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="num_immatriculation">Immatriculation</label>
            <input
              type="text"
              id="num_immatriculation"
              name="num_immatriculation"
              value={formData.num_immatriculation}
              onChange={handleChange}
              placeholder="Entrez l'immatriculation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="kilometrage">Kilométrage</label>
            <input
              type="number"
              id="kilometrage"
              name="kilometrage"
              value={formData.kilometrage}
              onChange={handleChange}
              placeholder="Entrez le kilométrage"
            />
          </div>
          <div className="form-group">
            <label htmlFor="proprietaire">Propriétaire</label>
            <Select
              id="proprietaire"
              name="proprietaire"
              value={users.find((user) => user.value === formData.proprietaire_id)}
              onChange={handleSelectChange}
              options={users}
              placeholder="Choisissez un propriétaire"
              isSearchable
            />
          </div>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin/vehicule')}
          >
            Retour
          </button>
          <button type="submit" className="submit-btn">
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVehicule;
