require('dotenv').config(); // Load environment variables

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'maintenance-service',
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = kafka;
