import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMaintenanceById } from '../../services/maintenanceService';
import { getUserByIdentifier } from '../../services/userService';
import { getVehicleById } from '../../services/vehicleService';
import './ViewMaintenance.css';

const ViewMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('maintenance'); // Gérer les onglets

  useEffect(() => {
    const fetchData = async () => {
      try {
        const maintenanceData = await getMaintenanceById(id);
        setMaintenance(maintenanceData);

        const vehicleData = await getVehicleById(maintenanceData.vehicle_id);
        setVehicle(vehicleData);

        const ownerData = await getUserByIdentifier(vehicleData.proprietaire_id);
        setOwner(ownerData);

        const mechanicData = await getUserByIdentifier(maintenanceData.mechanic_id);
        setMechanic(mechanicData);

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="view-maintenance-loading">Chargement...</div>;
  }

  const formattedStartDate = dayjs(maintenance.start_date).format('DD MMMM YYYY, HH:mm');
  const formattedEndDate = dayjs(maintenance.end_date).format('DD MMMM YYYY, HH:mm');
  const formattedAmount = `${maintenance.amount.toLocaleString()} XOF`;

  const renderTabContent = () => {
    const tabData = {
      maintenance: (
        <div className="view-maintenance-tab-content">
          <p><strong>ID :</strong> <span>{maintenance.id}</span></p>
          <p><strong>Date de début :</strong> <span>{formattedStartDate}</span></p>
          <p><strong>Date de fin :</strong> <span>{formattedEndDate}</span></p>
          <p><strong>Montant :</strong> <span>{formattedAmount}</span></p>
          <p><strong>Statut :</strong> <span>{maintenance.status === 'completed' ? 'Terminé' : 'En cours'}</span></p>
          <p><strong>Description :</strong> <span>{maintenance.description}</span></p>
        </div>

      ),
      mechanic: (
        <div className="view-maintenance-tab-content">
          {mechanic ? (
            <>
              <p><strong>ID :</strong> {mechanic.id}</p>
              <p><strong>Nom :</strong> {mechanic.lastName}</p>
              <p><strong>Prénom :</strong> {mechanic.firstName}</p>
              <p><strong>Email :</strong> {mechanic.email}</p>
            </>
          ) : (
            <div>
              <p>
                Chargement des informations du mécanicien... Si cela prend du temps, pensez à
                assigner la maintenance à un mécanicien. Cliquez ici pour le faire :
              </p>
              <button
                className="assign-btn"
                onClick={() => navigate(`/admin/maintenance/edit/${maintenance.id}`)}
              >
                Assigner un mécanicien
              </button>

            </div>
          )}
        </div>
      ),
      vehicle: (
        <div className="view-maintenance-tab-content">
          {vehicle ? (
            <>
              <p><strong>ID :</strong> {vehicle.id}</p>
              <p><strong>Marque :</strong> {vehicle.marque}</p>
              <p><strong>Modèle :</strong> {vehicle.modele}</p>
              <p><strong>Année :</strong> {vehicle.annee}</p>
              <p><strong>Immatriculation :</strong> {vehicle.num_immatriculation}</p>
            </>
          ) : (
            <p>Chargement des informations du véhicule...</p>
          )}
        </div>
      ),
      owner: (
        <div className="view-maintenance-tab-content">
          {owner ? (
            <>
              <p><strong>ID :</strong> {owner.id}</p>
              <p><strong>Nom :</strong> {owner.lastName}</p>
              <p><strong>Prénom :</strong> {owner.firstName}</p>
              <p><strong>Email :</strong> {owner.email}</p>
            </>
          ) : (
            <p>Chargement des informations du propriétaire...</p>
          )}
        </div>
      ),
    };
    return tabData[activeTab];
  };

  return (
    <div className="view-maintenance-container">
      <h2>Détails de la Maintenance</h2>
      <div className="tabs">
        {['maintenance', 'mechanic', 'vehicle', 'owner'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default ViewMaintenance;
