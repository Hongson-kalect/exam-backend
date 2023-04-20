const testRoomServices = require("../services/testRoom");

const addTestRoom = async (req, res) => {
  const servicesRes = await testRoomServices.add(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: "cant add test Room" });
};
const editTestRoom = async (req, res) => {
  const servicesRes = await testRoomServices.editTestRoom(req.body);
  res.json(servicesRes);
};
const delTestRoom = async (req, res) => {
  const servicesRes = await testRoomServices.delTestRoom(req.query);
  res.json(servicesRes);
};
const getUnSubmit = async (req, res) => {
  try {
    const servicesRes = await testRoomServices.getUnSubmit(req.query);
    res.json(servicesRes);
  } catch (error) {
    res.json({ status: -1, message: error });
  }
};
const getResult = async (req, res) => {
  try {
    const servicesRes = await testRoomServices.getResult(req.query);
    res.json(servicesRes);
  } catch (error) {
    res.json({ status: -1, message: error });
  }
};
const getTestRoomType = async (req, res) => {
  const servicesRes = await testRoomServices.getTestRoomType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant get testRoom type" });
};
const getTestRoom = async (req, res) => {
  const servicesRes = await testRoomServices.getTestRoom(req.query);
  if (servicesRes) return await res.json({ status: 1, data: servicesRes });
  else return await res.json({ status: 0, message: "cant get testRoom" });
};
const addTestRoomType = async (req, res) => {
  const servicesRes = await testRoomServices.addTestRoomType(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "cant add testRoom" });
};
const getAttempt = async (req, res) => {
  const servicesRes = await testRoomServices.getAttempt(req.query);
  res.json(servicesRes);
};
const startAttempt = async (req, res) => {
  const servicesRes = await testRoomServices.startAttempt(req.body);
  res.json(servicesRes);
};

module.exports = {
  addTestRoom,
  editTestRoom,
  getTestRoomType,
  getTestRoom,
  addTestRoomType,
  delTestRoom,
  getAttempt,
  startAttempt,
  getUnSubmit,
  getResult,
};
