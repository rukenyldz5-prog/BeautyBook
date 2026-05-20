const appointmentModel = require("../models/appointmentModel");
const { httpError, validateAppointmentInput } = require("./validators");

async function create(userId, payload) {
  validateAppointmentInput(payload);
  const status = payload.status || "planned";
  const created = await appointmentModel.createAppointment({ ...payload, userId, status });
  return appointmentModel.findById(created.id);
}

async function list(userId, search) {
  return appointmentModel.listByUserId(userId, (search || "").trim());
}

async function update(userId, id, payload) {
  validateAppointmentInput(payload);
  const existing = await appointmentModel.findById(id);
  if (!existing) throw httpError(404, "Appointment not found");
  if (existing.userId !== userId) throw httpError(403, "You cannot modify this appointment");

  const status = payload.status || existing.status;
  await appointmentModel.updateAppointment(id, { ...payload, status });
  return appointmentModel.findById(id);
}

async function remove(userId, id) {
  const existing = await appointmentModel.findById(id);
  if (!existing) throw httpError(404, "Appointment not found");
  if (existing.userId !== userId) throw httpError(403, "You cannot delete this appointment");

  await appointmentModel.removeAppointment(id);
}

module.exports = { create, list, update, remove };
