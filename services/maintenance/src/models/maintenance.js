const db = require('../config/database');

const Maintenance = {
  async create(maintenance) {
    const query = `
      INSERT INTO maintenances (vehicle_id, start_date, end_date, mechanic_id, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      maintenance.vehicle_id,
      maintenance.start_date,
      maintenance.end_date,
      maintenance.mechanic_id,
      maintenance.status,
    ]);
    return result;
  },

  async getById(id) {
    const query = `SELECT * FROM maintenances WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  async updateStatus(id, status) {
    const query = `UPDATE maintenances SET status = ? WHERE id = ?`;
    const [result] = await db.execute(query, [status, id]);
    return result;
  },
};

module.exports = Maintenance;
