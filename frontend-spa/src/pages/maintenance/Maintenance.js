import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Maintenance.css';
import { getMaintenances, deleteMaintenance } from '../../services/maintenanceService';

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const data = await getMaintenances();
        if (data) {
          setMaintenances(data);
          setFilteredMaintenances(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des maintenances:', error);
      }
    };

    fetchMaintenances();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?");
    if (confirmDelete) {
      try {
        await deleteMaintenance(id);
        const updatedMaintenances = maintenances.filter((maintenance) => maintenance.id !== id);
        setMaintenances(updatedMaintenances);
        setFilteredMaintenances(updatedMaintenances);
        alert('Maintenance supprimée avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Impossible de supprimer cette maintenance.');
      }
    }
  };

  const handleFilter = () => {
    let filtered = [...maintenances];

    if (statusFilter) {
      filtered = filtered.filter((maintenance) => maintenance.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter((maintenance) => new Date(maintenance.start_date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((maintenance) => new Date(maintenance.start_date) <= new Date(endDate));
    }

    setFilteredMaintenances(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setFilteredMaintenances(maintenances);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMaintenances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMaintenances.length / itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-orange',
      confirmed: 'badge-blue',
      completed: 'badge-green',
      cancelled: 'badge-red',
    };
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div className="maintenance-container">
      <div className="header">
        <h2>Liste des maintenance </h2>
        <button className="create-btn" onClick={() => navigate('/admin/maintenance/create')}>
          <FontAwesomeIcon icon={faPlus} /> Créer une maintenance
        </button>
      </div>

      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Date de début" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Date de fin" />
        <button onClick={handleFilter}>Filtrer</button>
        <button onClick={handleResetFilters}>Réinitialiser</button>
      </div>

      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((maintenance) => (
              <tr key={maintenance.id} onClick={() => navigate(`/admin/maintenance/${maintenance.id}`)}>
                <td>{formatDateTime(maintenance.start_date)}</td>
                <td>{maintenance.description}</td>
                <td>{getStatusBadge(maintenance.status)}</td>
                <td className="actions">
                  <button className={`icon-btn edit-btn ${maintenance.status === 'completed' ? 'disabled' : ''}`}
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/maintenance/edit/${maintenance.id}`); }}
                    disabled={maintenance.status === 'completed'}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="icon-btn delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(maintenance.id); }}
                    title="Supprimer">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Aucune maintenance à afficher</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={i + 1 === currentPage ? 'active' : ''} onClick={() => changePage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
