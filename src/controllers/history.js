const historyServices = require("../services/history");

const addHistory = async (req, res) => {
  const servicesRes = await historyServices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add test Room" });
};
const editHistory = async (req, res) => {
  const servicesRes = await historyServices.editHistory(req.body);
  res.json(servicesRes);
};
const delHistory = async (req, res) => {
  const servicesRes = await historyServices.delHistory(req.query);
  res.json(servicesRes);
};

const getHistory = async (req, res) => {
  const servicesRes = await historyServices.getHistory(req.query);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get history" });
};
const addHistoryType = async (req, res) => {
  const servicesRes = await historyServices.addHistoryType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant add history" });
};

module.exports = {
  addHistory,
  editHistory,
  getHistory,
  addHistoryType,
  delHistory,
};
