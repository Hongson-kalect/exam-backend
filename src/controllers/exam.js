const examServices = require("../services/exam");

const addExam = async (req, res) => {
  const servicesRes = await examServices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add Exam" });
};
const editExam = async (req, res) => {
  const servicesRes = await examServices.editExam(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add exam" });
};
const delExam = async (req, res) => {
  const servicesRes = await examServices.delExam(req.params);
  if (servicesRes) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add exam" });
};
const getExamType = async (req, res) => {
  const servicesRes = await examServices.getExamType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam type" });
};

const getExam = async (req, res) => {
  const servicesRes = await examServices.getExam(req.query);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam" });
};
const getContineu = async (req, res) => {
  const servicesRes = await examServices.getContineu(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam" });
};
const submitExam = async (req, res) => {
  const servicesRes = await examServices.submitExam(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam" });
};
const closeTab = async (req, res) => {
  const servicesRes = await examServices.closeTab(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam" });
};
const submitCurrent = async (req, res) => {
  const servicesRes = await examServices.submitCurrent(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get exam" });
};

const addExamType = async (req, res) => {
  const servicesRes = await examServices.addExamType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant add exam" });
};

module.exports = {
  addExam,
  editExam,
  getExamType,
  getExam,
  getContineu,
  addExamType,
  delExam,
  submitExam,
  closeTab,
  submitCurrent,
};
