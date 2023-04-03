const userServices = require("../services/user");

const getUserByEmail = async (req, res) => {
  const servicesRes = await userServices.getUserByEmail(req.query);
  res.json(servicesRes);
};
module.exports = { getUserByEmail };
