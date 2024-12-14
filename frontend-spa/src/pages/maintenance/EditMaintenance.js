import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { getMaintenanceById, updateMaintenance } from '../../services/maintenanceService';
import { getUserByIdentifier, getUsersByRole } from '../../services/userService';
import { getVehicleById, getVehiclesByOwnerId } from '../../services/vehicleService';
import './EditMaintenance.css';

const EditMaintenance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [maintenance, setMaintenance] = useState(null);
    const [mechanic, setMechanic] = useState(null);
    const [owner, setOwner] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [mechanicsList, setMechanicsList] = useState([]);
    const [ownersList, setOwnersList] = useState([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        amount: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        description: '',
        mechanic_id: '',
        owner_id: '',
        vehicle_id: '',
        status: 'pending',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const maintenanceData = await getMaintenanceById(id);
                if (!maintenanceData) throw new Error('Maintenance introuvable.');
                setMaintenance(maintenanceData);

                const mechanicData = maintenanceData.mechanic_id
                    ? await getUserByIdentifier(maintenanceData.mechanic_id)
                    : null;
                setMechanic(mechanicData);

                const vehicleData = maintenanceData.vehicle_id
                    ? await getVehicleById(maintenanceData.vehicle_id)
                    : null;
                setVehicle(vehicleData);

                const ownerData = vehicleData?.proprietaire_id
                    ? await getUserByIdentifier(vehicleData.proprietaire_id)
                    : null;
                setOwner(ownerData);

                setMechanicsList(await getUsersByRole('mecanicien'));
                setOwnersList(await getUsersByRole('client'));

                if (ownerData) {
                    const vehicles = await getVehiclesByOwnerId(ownerData.id);
                    setVehiclesList(vehicles);
                }

                setFormData({
                    amount: maintenanceData.amount || '',
                    start_date: dayjs(maintenanceData.start_date).format('YYYY-MM-DD'),
                    start_time: dayjs(maintenanceData.start_date).format('HH:mm'),
                    end_date: dayjs(maintenanceData.end_date).format('YYYY-MM-DD'),
                    end_time: dayjs(maintenanceData.end_date).format('HH:mm'),
                    description: maintenanceData.description || '',
                    mechanic_id: maintenanceData.mechanic_id || '',
                    owner_id: maintenanceData.owner_id || '',
                    vehicle_id: maintenanceData.vehicle_id || '',
                    status: maintenanceData.status || 'pending',
                });

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (key, selectedOption) => {
        setFormData((prev) => ({ ...prev, [key]: selectedOption.value }));

        if (key === 'mechanic_id') {
            const selectedMechanic = mechanicsList.find((m) => m.id === selectedOption.value);
            setMechanic(selectedMechanic); // Synchroniser l'état du mécanicien
        }
    };


    const handleOwnerChange = async (selectedOption) => {
        const ownerId = selectedOption.value;
        setFormData((prev) => ({ ...prev, owner_id: ownerId, vehicle_id: '' }));
        const vehicles = await getVehiclesByOwnerId(ownerId);
        setVehiclesList(vehicles);
        const selectedOwner = ownersList.find((o) => o.id === ownerId);
        setOwner(selectedOwner);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                start_date: `${formData.start_date}T${formData.start_time}:00`,
                end_date: `${formData.end_date}T${formData.end_time}:00`,
            };
            await updateMaintenance(id, payload);
            navigate('/admin/maintenance');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la maintenance :', error);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="edit-maintenance-container">
            <h2>Modifier la Maintenance</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Statut</label>
                        <Select
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                            value={{
                                value: formData.status,
                                label: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
                            }}
                            onChange={(selectedOption) => handleSelectChange('status', selectedOption)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Montant</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date de début</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                        />
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Date de fin</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                        />
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mécanicien</label>
                        <Select
                            options={mechanicsList.map((m) => ({
                                value: m.id,
                                label: `${m.firstName} ${m.lastName}`,
                            }))}
                            value={
                                mechanic
                                    ? { value: mechanic.id, label: `${mechanic.firstName} ${mechanic.lastName}` }
                                    : null
                            }
                            onChange={(selectedOption) => handleSelectChange('mechanic_id', selectedOption)}
                        />

                    </div>

                    <div className="form-group">
                        <label>Propriétaire</label>
                        <Select
                            options={ownersList.map((o) => ({
                                value: o.id,
                                label: `${o.firstName} ${o.lastName}`,
                            }))}
                            value={owner ? { value: owner.id, label: `${owner.firstName} ${owner.lastName}` } : null}
                            onChange={handleOwnerChange}
                        />
                    </div>

                    <div className="form-group vehicule-field">
                        <label>Véhicule</label>
                        <Select
                            options={vehiclesList.map((v) => ({
                                value: v.id,
                                label: `${v.marque} ${v.modele} (${v.annee})`,
                            }))}
                            value={vehicle ? { value: vehicle.id, label: `${vehicle.marque} ${vehicle.modele} (${vehicle.annee})` } : null}
                            onChange={(selectedOption) => handleSelectChange('vehicle_id', selectedOption)}
                        />
                    </div>
                </div>

                <div className="form-group description-field">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default EditMaintenance;
