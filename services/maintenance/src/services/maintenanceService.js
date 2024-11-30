const Maintenance = require('../models/maintenance');

async function planMaintenance(data) {
  return Maintenance.create(data);
}

async function updateMaintenanceStatus(id, status) {
  return Maintenance.updateStatus(id, status);
}

async function getMaintenanceDetails(id) {
  return Maintenance.getById(id);
}

module.exports = { planMaintenance, updateMaintenanceStatus, getMaintenanceDetails };
