import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deleteUser, getUsers } from '../../services/userService';
import './User.css'; // Assurez-vous d'avoir un fichier CSS pour le style

const User = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
                setFilteredUsers(usersData);
                setLoading(false);
            } catch (error) {
                setError('Erreur lors de la récupération des utilisateurs');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search and filters
    const filterUsers = useCallback(() => {
        const filtered = users.filter((user) => {
            const nameMatch =
                user.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchName.toLowerCase());
            const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());

            // Date filters
            const startDateMatch = startDate ? new Date(user.createdAt) >= new Date(startDate) : true;
            const endDateMatch = endDate ? new Date(user.createdAt) <= new Date(endDate) : true;

            // Role filter
            const roleMatch = roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true;

            return nameMatch && emailMatch && startDateMatch && endDateMatch && roleMatch;
        });

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    }, [users, searchName, searchEmail, startDate, endDate, roleFilter]);

    // Reset all filters
    const resetFilters = () => {
        setSearchName('');
        setSearchEmail('');
        setStartDate('');
        setEndDate('');
        setRoleFilter('');
        setFilteredUsers(users);
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle delete user
    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
        if (confirmDelete) {
            try {
                await deleteUser(id);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user.id !== id));
                alert('Utilisateur supprimé avec succès.');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Impossible de supprimer cet utilisateur.');
            }
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-container">
            <div className="header">
                <h2>Liste des utilisateurs</h2>
                <Link to="/admin/user/create">
                    <button className="create-user-btn">
                        <FontAwesomeIcon icon={faPlus} /> Créer un utilisateur
                    </button>
                </Link>
            </div>

            {/* Filters Section */}
            <div className="filters">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">Tous</option>
                    <option value="client">Client</option>
                    <option value="mecanicien">Mécanicien</option>
                </select>

                <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Nom ou Prénom"
                />

                <input
                    type="text"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={filterUsers} className="apply-filters-btn">Filtrer</button>
                <button onClick={resetFilters} className="reset-filters-btn">Réinitialiser</button>
            </div>

            {/* Users List */}
            <div className="users-list">
                {currentUsers.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Date de création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id} onClick={() => window.location.href = `/admin/user/${user.id}`}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/user/edit/${user.id}`);
                                            }}
                                            className="icon-btn edit-icon"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.id);
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
                ) : (
                    <p>Aucun utilisateur trouvé avec les filtres appliqués.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default User;
