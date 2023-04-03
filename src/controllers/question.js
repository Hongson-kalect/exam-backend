const { ExcelToDatabase } = require("../services/global");
const questionServices = require("../services/question");

const addQuestion = async (req, res) => {
  const servicesRes = await questionServices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add question" });
};
const addAllQuestion = async (req, res) => {
  const servicesRes = await questionServices.addAllQuestion(req.body);
  return servicesRes;
};
const addExcel = async (req, res) => {
  const servicesRes = await ExcelToDatabase(req.file, "Question");
  if (servicesRes === true)
    res.json({ status: 1, message: "Add question completed" });
  else res.json({ status: 0, message: "cant add question" });
};
const editQuestion = async (req, res) => {
  const servicesRes = await questionServices.editQuestion(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add question" });
};
const delQuestion = async (req, res) => {
  const servicesRes = await questionServices.delQuestion(req.params);
  if (servicesRes) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add question" });
};
const getQuestionType = async (req, res) => {
  const servicesRes = await questionServices.getQuestionType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get question type" });
};
const getQuestion = async (req, res) => {
  const servicesRes = await questionServices.getQuestion(req.query);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get question" });
};
const addQuestionType = async (req, res) => {
  const servicesRes = await questionServices.addQuestionType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant add question" });
};

module.exports = {
  addQuestion,
  addExcel,
  editQuestion,
  getQuestionType,
  getQuestion,
  addQuestionType,
  delQuestion,

  addAllQuestion,
};
