const testServices = require("../services/test");

const addTest = async (req, res) => {
  const servicesRes = await testServices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add test" });
};
const editTest = async (req, res) => {
  const servicesRes = await testServices.editTest(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add test" });
};
const delTest = async (req, res) => {
  const servicesRes = await testServices.delTest(req.params);
  if (servicesRes) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add test" });
};
const getTestType = async (req, res) => {
  const servicesRes = await testServices.getTestType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get test type" });
};
const getTestBySubject = async (req, res) => {
  const servicesRes = await testServices.getTestBySubject(req.params);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get test type" });
};
const getTest = async (req, res) => {
  const servicesRes = await testServices.getTest(req.query);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get test" });
};
const addTestType = async (req, res) => {
  const servicesRes = await testServices.addTestType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant add test" });
};

module.exports = {
  addTest,
  editTest,
  getTestType,
  getTest,
  getTestBySubject,
  addTestType,
  delTest,
};
