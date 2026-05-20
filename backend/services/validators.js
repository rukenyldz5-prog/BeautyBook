const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUS = ["planned", "completed", "cancelled"];

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function validateRegisterInput({ name, email, password }) {
  if (!name || name.trim().length < 2) throw httpError(400, "Name must be at least 2 characters");
  if (!email || !EMAIL_RE.test(email)) throw httpError(400, "Invalid email");
  if (!password || password.length < 6) throw httpError(400, "Password must be at least 6 characters");
}

function validateAppointmentInput(payload) {
  const { serviceName, employeeName, appointmentDate, status } = payload;
  if (!serviceName || serviceName.trim().length < 2) throw httpError(400, "Service name is required");
  if (!employeeName || employeeName.trim().length < 2) throw httpError(400, "Employee name is required");
  if (!appointmentDate || Number.isNaN(Date.parse(appointmentDate))) throw httpError(400, "Invalid appointment date");
  if (status && !ALLOWED_STATUS.includes(status)) throw httpError(400, "Invalid status");
}

module.exports = { httpError, validateRegisterInput, validateAppointmentInput, ALLOWED_STATUS };
