const { run, get, all } = require("../config/db");

function createAppointment({ userId, serviceName, employeeName, appointmentDate, status, note }) {
  return run(
    "INSERT INTO appointments (userId, serviceName, employeeName, appointmentDate, status, note) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, serviceName, employeeName, appointmentDate, status, note || null]
  );
}

function listByUserId(userId, search = "") {
  if (!search) {
    return all("SELECT * FROM appointments WHERE userId = ? ORDER BY appointmentDate ASC", [userId]);
  }

  const q = `%${search}%`;
  return all(
    `SELECT * FROM appointments
     WHERE userId = ?
     AND (serviceName LIKE ? OR employeeName LIKE ? OR IFNULL(note, '') LIKE ?)
     ORDER BY appointmentDate ASC`,
    [userId, q, q, q]
  );
}

function findById(id) {
  return get("SELECT * FROM appointments WHERE id = ?", [id]);
}

function updateAppointment(id, payload) {
  return run(
    "UPDATE appointments SET serviceName = ?, employeeName = ?, appointmentDate = ?, status = ?, note = ? WHERE id = ?",
    [payload.serviceName, payload.employeeName, payload.appointmentDate, payload.status, payload.note || null, id]
  );
}

function removeAppointment(id) {
  return run("DELETE FROM appointments WHERE id = ?", [id]);
}

module.exports = {
  createAppointment,
  listByUserId,
  findById,
  updateAppointment,
  removeAppointment
};
