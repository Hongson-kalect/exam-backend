const { globalSevices } = require("../services/global");
const sendEmail = require("../ultis/mailer");
const signUp = async (req, res) => {
  const servicesRes = await globalSevices.signUp(req.body);
  if (servicesRes === true) res.json({ status: 1 });
  else res.json({ status: 0, message: servicesRes });
};
const getUser = async (req, res) => {
  const servicesRes = await globalSevices.getUser(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else
    res.json({ status: 0, message: "email, username or password not correct" });
};
const getPass = async (req, res) => {
  sendEmail();
  res.send("let check your mail");
  // const servicesRes = await globalSevices.getUser(req.body);
  // if (servicesRes) res.json({ status: 1, data: servicesRes });
  // else
  //   res.json({ status: 0, message: "email, username or password not correct" });
};
const getUserByToken = async (req, res) => {
  const servicesRes = await globalSevices.getUserByToken(req.body);
  if (servicesRes) res.json({ status: 1, data: servicesRes });
  else res.json({ status: 0, message: "token not found" });
};
module.exports = { signUp, getUser, getPass, getUserByToken };
