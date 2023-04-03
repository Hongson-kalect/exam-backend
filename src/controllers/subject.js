const subjectSevices = require("../services/subject");
const getPermission = async (req, res) => {
  const servicesRes = await subjectSevices.getPermission(req.body);
  res.json(servicesRes);
};
const add = async (req, res) => {
  const servicesRes = await subjectSevices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: servicesRes });
};

const leaveRoom = async (req, res) => {
  const servicesRes = await subjectSevices.leaveRoom(req.body);
  res.json(servicesRes);
};
const joinByHash = async (req, res) => {
  const servicesRes = await subjectSevices.joinByHash(req.body);
  res.json(servicesRes);
};

const get = async (req, res) => {
  const servicesRes = await subjectSevices.get(req.params);
  if (servicesRes.length > 0) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "no subject found" });
};
const editSubject = async (req, res) => {
  const servicesRes = await subjectSevices.editSubject(req.body);
  res.json(servicesRes);
};
const delSubject = async (req, res) => {
  const servicesRes = await subjectSevices.delSubject(req.body);
  res.json(servicesRes);
};
const getInfo = async (req, res) => {
  const servicesRes = await subjectSevices.getInfo(req.params);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "no subject found" });
};
const getName = async (req, res) => {
  const servicesRes = await subjectSevices.getName(req.params);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "no subject found" });
};
const getMember = async (req, res) => {
  const servicesRes = await subjectSevices.getMember(req.body);
  res.json(servicesRes);
};
const searchMember = async (req, res) => {
  const servicesRes = await subjectSevices.searchMember(req.body);
  res.json(servicesRes);
};
const handleAddMember = async (req, res) => {
  const servicesRes = await subjectSevices.handleAddMember(req.body);
  res.json(servicesRes);
};
const makeHost = async (req, res) => {
  const servicesRes = await subjectSevices.makeHost(req.body);
  res.json(servicesRes);
};
const removeDeputy = async (req, res) => {
  const servicesRes = await subjectSevices.removeDeputy(req.body);
  res.json(servicesRes);
};
const makeDeputy = async (req, res) => {
  const servicesRes = await subjectSevices.makeDeputy(req.body);
  res.json(servicesRes);
};
const kick = async (req, res) => {
  const servicesRes = await subjectSevices.kick(req.body);
  res.json(servicesRes);
};

module.exports = {
  getPermission,
  add,
  get,
  getName,
  joinByHash,
  getInfo,
  editSubject,
  delSubject,
  leaveRoom,
  getMember,
  searchMember,
  handleAddMember,
  makeHost,
  removeDeputy,
  makeDeputy,
  kick,
};
