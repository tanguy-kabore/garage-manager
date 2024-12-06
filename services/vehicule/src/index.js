require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('@routes/vehiculeRoutes');
const { specs, swaggerUi } = require('@src/swagger');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use('/api/vehicules', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
  });
