const db = require('../config/database');

const Mechanic = {
  async getAll() {
    const query = `SELECT * FROM mechanics`;
    const [rows] = await db.execute(query);
    return rows;
  },
};

module.exports = Mechanic;
