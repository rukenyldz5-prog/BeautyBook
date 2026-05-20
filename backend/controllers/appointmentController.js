const appointmentService = require("../services/appointmentService");

async function create(req, res, next) {
  try {
    const row = await appointmentService.create(req.user.userId, req.body);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const rows = await appointmentService.list(req.user.userId, req.query.search);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const row = await appointmentService.update(req.user.userId, Number(req.params.id), req.body);
    res.status(200).json(row);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await appointmentService.remove(req.user.userId, Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, update, remove };
