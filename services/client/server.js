const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = require('./database'); // Ensure you have this module to interact with your database

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//Swagger

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Client Management API',
        version: '1.0.0',
        description: 'This is a simple API for managing clients including CRUD operations',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development Server'
        }
      ],
    },
    apis: ['./server.js'],
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Adds a new client
 *     description: Registers a new client in the database.
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identity_number
 *               - first_name
 *               - last_name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               identity_number:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 */
// POST route to add a new client with validation
app.post('/api/clients', [
    body('identity_number').notEmpty().withMessage('Identity number is required'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('phone').isMobilePhone().withMessage('Phone must be a valid mobile number'),
    body('address').notEmpty().withMessage('Address is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { identity_number, first_name, last_name, address, phone, email } = req.body;
    const query = `INSERT INTO clients (identity_number, first_name, last_name, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [identity_number, first_name, last_name, address, phone, email], (err, result) => {
        if (err) {
            res.status(500).send({ message: "Error adding client: " + err });
            return;
        }
        res.send({ message: "Client added successfully!" });
    });
});






/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Retrieves all clients
 *     description: Returns a list of all clients in the database.
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       500:
 *         description: Server error
 */
//GET Endpoint to Retrieve a Specific Client by ID
app.get('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send({ message: "Error retrieving client: " + err });
            return;
        }
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send({ message: "Client not found" });
        }
    });
});



//PUT Endpoint to Update Existing Client Details

//const express = require('express');
//const bodyParser = require('body-parser');
//const { body, validationResult } = require('express-validator');
//const app = express();
//const port = 3000;

//app.use(bodyParser.json());

//const db = require('./database'); // Ensure you have this module to interact with your database

// POST route to add a new client with validation
app.post('/api/clients', [
    body('identity_number').notEmpty().withMessage('Identity number is required'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('phone').isMobilePhone().withMessage('Phone must be a valid mobile number'),
    body('address').notEmpty().withMessage('Address is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { identity_number, first_name, last_name, address, phone, email } = req.body;
    const query = `INSERT INTO clients (identity_number, first_name, last_name, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [identity_number, first_name, last_name, address, phone, email], (err, result) => {
        if (err) {
            res.status(500).send({ message: "Error adding client: " + err });
            return;
        }
        res.send({ message: "Client added successfully!" });
    });
});


//
/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update an existing client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error updating client
 */


// PUT route to update an existing client with validation
app.put('/api/clients/:id', [
    body('identity_number').notEmpty().withMessage('Identity number is required'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('phone').isMobilePhone().withMessage('Phone must be a valid mobile number'),
    body('address').notEmpty().withMessage('Address is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { identity_number, first_name, last_name, address, phone, email } = req.body;
    const query = `UPDATE clients SET identity_number = ?, first_name = ?, last_name = ?, address = ?, phone = ?, email = ? WHERE id = ?`;

    db.query(query, [identity_number, first_name, last_name, address, phone, email, id], (err, result) => {
        if (err) {
            res.status(500).send({ message: "Error updating client: " + err });
            return;
        }
        if (result.affectedRows == 0) {
            res.status(404).send({ message: "Client not found" });
        } else {
            res.send({ message: "Client updated successfully!" });
        }
    });
});

//app.listen(port, () => {
  //  console.log(`Server running on port ${port}`);
//});



//
/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Deletes a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The client id to delete
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error deleting client
 */


//DELETE Endpoint to Remove a Client from the Database
app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clients WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send({ message: "Error deleting client: " + err });
            return;
        }
        if (result.affectedRows == 0) {
            res.status(404).send({ message: "Client not found" });
        } else {
            res.send({ message: "Client deleted successfully!" });
        }
    });
});



//Schema Definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - identity_number
 *         - first_name
 *         - last_name
 *         - email
 *         - phone
 *         - address
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the client.
 *         identity_number:
 *           type: string
 *           description: The identity number of the client.
 *         first_name:
 *           type: string
 *           description: The first name of the client.
 *         last_name:
 *           type: string
 *           description: The last name of the client.
 *         email:
 *           type: string
 *           description: The email address of the client.
 *         phone:
 *           type: string
 *           description: The phone number of the client.
 *         address:
 *           type: string
 *           description: The address of the client.
 */



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
