import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteVehicle, getVehicles } from "../../services/vehicleService";
import "./Vehicule.css";

const Vehicule = () => {
  const [vehicules, setVehicules] = useState([]); // Liste complète des véhicules
  const [filteredVehicules, setFilteredVehicules] = useState([]); // Liste filtrée pour affichage
  const [filters, setFilters] = useState({
    marque: "",
    modele: "",
    immatriculation: "",
    anneeMin: "",
    anneeMax: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Page courante pour la pagination
  const [itemsPerPage] = useState(5); // Nombre d'éléments par page
  const [error, setError] = useState(null); // Gestion des erreurs

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getVehicles(); // Appel au service pour récupérer les véhicules
        setVehicules(data); // Initialisation de la liste complète
        setFilteredVehicules(data); // Initialisation de la liste filtrée
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules :", error);
        setError("Erreur lors de la récupération des véhicules.");
      }
    };

    fetchVehicules();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    const { marque, modele, immatriculation, anneeMin, anneeMax } = filters;
    const filtered = vehicules.filter((vehicule) => {
      return (
        (marque ? vehicule.marque.toLowerCase().includes(marque.toLowerCase()) : true) &&
        (modele ? vehicule.modele.toLowerCase().includes(modele.toLowerCase()) : true) &&
        (immatriculation
          ? vehicule.num_immatriculation
            .toLowerCase()
            .includes(immatriculation.toLowerCase())
          : true) &&
        (anneeMin ? vehicule.annee >= parseInt(anneeMin) : true) &&
        (anneeMax ? vehicule.annee <= parseInt(anneeMax) : true)
      );
    });
    setFilteredVehicules(filtered);
    setCurrentPage(1); // Réinitialisation à la première page
  };

  const resetFilters = () => {
    setFilters({
      marque: "",
      modele: "",
      immatriculation: "",
      anneeMin: "",
      anneeMax: "",
    });
    setFilteredVehicules(vehicules); // Réinitialiser à la liste complète
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce véhicule ?")) {
      try {
        await deleteVehicle(id); // Appel au service pour supprimer le véhicule
        // Mise à jour de l'état pour supprimer le véhicule de la liste
        setVehicules((prev) => prev.filter((vehicule) => vehicule.id !== id));
        setFilteredVehicules((prev) => prev.filter((vehicule) => vehicule.id !== id));
        alert("Véhicule supprimé avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression du véhicule :", error);
        alert("Erreur lors de la suppression du véhicule.");
      }
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicules = filteredVehicules.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredVehicules.length / itemsPerPage);

  return (
    <div className="vehicule-container">
      <div className="header">
        <h2>Liste des véhicules</h2>
        <button className="create-btn" onClick={() => navigate("/admin/vehicule/create")}>
          <FontAwesomeIcon icon={faPlus} /> Créer un véhicule
        </button>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Marque"
          name="marque"
          value={filters.marque}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Modèle"
          name="modele"
          value={filters.modele}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Immatriculation"
          name="immatriculation"
          value={filters.immatriculation}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Année min"
          name="anneeMin"
          value={filters.anneeMin}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Année max"
          name="anneeMax"
          value={filters.anneeMax}
          onChange={handleFilterChange}
        />
        <button onClick={applyFilters}>Filtrer</button>
        <button onClick={resetFilters} className="reset-btn">Réinitialiser</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="vehicule-table">
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Immatriculation</th>
            <th>Kilométrage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVehicules.map((vehicule) => (
            <tr key={vehicule.id} onClick={() => window.location.href = `/admin/vehicule/${vehicule.id}`}>
              <td>{vehicule.marque}</td>
              <td>{vehicule.modele}</td>
              <td>{vehicule.annee}</td>
              <td>{vehicule.num_immatriculation}</td>
              <td>{vehicule.kilometrage}</td>
              <td className="actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/vehicule/edit/${vehicule.id}`);
                  }}
                  className="icon-btn edit-icon"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={(e) => {
                  e.stopPropagation(); // Empêche la propagation du clic au parent (tr)
                  handleDelete(vehicule.id);
                }}
                  className="icon-btn delete-icon"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={currentPage === page + 1 ? "active" : ""}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Vehicule;
