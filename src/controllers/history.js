const historyServices = require("../services/history");

const getHistory = async (req, res) => {
  const servicesRes = await historyServices.getHistory(req.query);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get history" });
};

module.exports = {
  getHistory,
};
