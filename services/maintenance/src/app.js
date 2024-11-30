const express = require('express');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api/maintenances', maintenanceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Maintenance Service running on port ${PORT}`);
});
