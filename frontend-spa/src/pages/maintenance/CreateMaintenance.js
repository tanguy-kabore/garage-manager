import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { createMaintenance } from '../../services/maintenanceService';
import { getUsersByRole } from '../../services/userService';
import { getVehicles } from '../../services/vehicleService';
import './CreateMaintenance.css';

const CreateMaintenance = () => {
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const vehiclesData = await getVehicles();
      setVehicles(vehiclesData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !startDate || !endDate || !vehicleId) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    // Créer l'objet maintenance
    const newMaintenance = {
      description,
      start_date: startDate,
      end_date: endDate,
      vehicle_id: vehicleId,
    };

    try {
      await createMaintenance(newMaintenance);
      alert('Maintenance créée avec succès.');
      navigate('/admin/maintenance');
    } catch (err) {
      setError('Une erreur est survenue lors de la création de la maintenance.');
      console.error(err);
    }
  };

  return (
    <div className="create-maintenance-container">
      <div className="create-maintenance-header">
        <h2>Créer une nouvelle maintenance</h2>
        {error && <div className="error-message">{error}</div>}
      </div>

      <form className="create-maintenance-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la maintenance"
          />
        </div>

        <div className="date-group">
          <div className="form-group">
            <label htmlFor="startDate">Date et heure de début</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Date et heure de fin</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Véhicule */}
        <div className="form-group">
          <Select
            placeholder="Séléctionnez un véhicule"
            options={vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: `${vehicle.num_immatriculation} - ${vehicle.marque} ${vehicle.modele}`,
            }))}
            value={vehicleId ? { value: vehicleId, label: `${vehicles.find(v => v.id === vehicleId).num_immatriculation} - ${vehicles.find(v => v.id === vehicleId).marque} ${vehicles.find(v => v.id === vehicleId).modele}` } : null}
            onChange={(selectedOption) => setVehicleId(selectedOption?.value || '')}
          />
        </div>

        <button type="submit" className="submit-btn">Créer</button>
      </form>
    </div>
  );
};

export default CreateMaintenance;
