const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

router.post('/', maintenanceController.plan);
router.patch('/:id', maintenanceController.updateStatus);

module.exports = router;
