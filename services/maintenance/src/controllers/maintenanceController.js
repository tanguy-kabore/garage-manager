const maintenanceService = require('../services/maintenanceService');
const kafkaService = require('../services/kafkaService');

async function plan(req, res) {
  try {
    const maintenance = await maintenanceService.planMaintenance(req.body);
    await kafkaService.sendEvent('maintenance-planned', maintenance);
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await maintenanceService.updateMaintenanceStatus(id, status);
    await kafkaService.sendEvent('maintenance-status-updated', { id, status });
    res.status(200).json({ message: 'Maintenance status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { plan, updateStatus };
