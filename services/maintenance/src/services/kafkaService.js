const kafka = require('../config/kafka');

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'maintenance-group' });

/**
 * Ensures a topic exists before producing or consuming.
 * @param {string} topicName - The name of the topic.
 */
async function ensureTopicExists(topicName) {
  const admin = kafka.admin();
  await admin.connect();

  try {
    const topics = await admin.listTopics();
    if (!topics.includes(topicName)) {
      await admin.createTopics({
        waitForLeaders: true,
        topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
      });
      console.log(`Topic "${topicName}" created successfully.`);
    } else {
      console.log(`Topic "${topicName}" already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring topic exists:', error);
  } finally {
    await admin.disconnect();
  }
}

/**
 * Sends a message to the specified Kafka topic.
 * @param {string} topic - The topic name.
 * @param {Object} message - The message payload.
 */
async function sendEvent(topic, message) {
  try {
    await ensureTopicExists(topic);
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to topic "${topic}":`, message);
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
}

/**
 * Consumes messages from a specified Kafka topic.
 * @param {string} topic - The topic name.
 * @param {Function} handler - Callback to handle each consumed message.
 */
async function consumeEvents(topic, handler) {
  try {
    await ensureTopicExists(topic);
    await consumer.connect();
    await consumer.subscribe({ topic });
    console.log(`Subscribed to topic "${topic}".`);

    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log(`Message received from topic "${topic}":`, data);
        handler(data);
      },
    });
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
}

module.exports = { sendEvent, consumeEvents };
