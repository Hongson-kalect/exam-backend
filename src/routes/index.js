const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "./public/data/uploads/" });
const indexRoute = express.Router();
const {
  signUp,
  getUser,
  getUserByToken,
  getPass,
} = require("../controllers/global");
const {
  add,
  get,
  getName,
  joinByHash,
  getInfo,
  editSubject,
  delSubject,
  getPermission,
  leaveRoom,
  getMember,
  searchMember,
  handleAddMember,
  makeHost,
  removeDeputy,
  makeDeputy,
  kick,
} = require("../controllers/subject");
const {
  addQuestion,
  getQuestionType,
  addQuestionType,
  getQuestion,
  editQuestion,
  delQuestion,
  addExcel,
} = require("../controllers/question");
const {
  addTest,
  getTestType,
  addTestType,
  getTest,
  editTest,
  delTest,
  getTestBySubject,
} = require("../controllers/test");
const {
  addTestRoom,
  getTestRoomType,
  addTestRoomType,
  getTestRoom,
  editTestRoom,
  delTestRoom,
  getAttempt,
  startAttempt,
  getUnSubmit,
} = require("../controllers/testRoom");
const {
  getExam,
  submitExam,
  getContineu,
  submitCurrent,
  closeTab,
} = require("../controllers/exam");
const { getUserByEmail } = require("../controllers/user");
const { getHistory, addHistory } = require("../controllers/history");
const { testLayout } = require("../controllers/test-layout");
indexRoute.post("/signup", signUp);
indexRoute.post("/login", getUser);
indexRoute.get("/get-pass", getPass);
indexRoute.post("/get-token", getUserByToken);

indexRoute.post("/subject/permission", getPermission);
indexRoute.post("/subject", add);
indexRoute.post("/subject/leave", leaveRoom);
indexRoute.post("/subject/join", joinByHash);
indexRoute.get("/subject/:id", get);
indexRoute.put("/subject-info", editSubject);
indexRoute.post("/subject/disband", delSubject);
indexRoute.get("/subject-info/:id", getInfo);
indexRoute.get("/subject/get-name/:id", getName);
indexRoute.post("/subject/member", getMember);
indexRoute.post("/subject/member/search", searchMember);
indexRoute.post("/subject/member/add", handleAddMember);
indexRoute.post("/subject/make-host", makeHost);
indexRoute.post("/subject/remove-deputy", removeDeputy);
indexRoute.post("/subject/make-deputy", makeDeputy);
indexRoute.post("/subject/kick", kick);

indexRoute.post("/question", addQuestion);
indexRoute.post("/question/add-excel", upload.single("upload_file"), addExcel);
indexRoute.put("/question/edit", editQuestion);
indexRoute.delete("/question/del/:id", delQuestion);
indexRoute.get("/question/get-type", getQuestionType);
indexRoute.get("/question/get", getQuestion);
indexRoute.post("/question/add-type", addQuestionType);

indexRoute.post("/test", addTest);
indexRoute.put("/test/edit", editTest);
indexRoute.delete("/test/del/:id", delTest);
indexRoute.get("/test/get-type", getTestType);
indexRoute.get("/test/get", getTest);
indexRoute.get("/test/get/:subjectId", getTestBySubject);
indexRoute.post("/test/add-type", addTestType);

indexRoute.post("/test-room", addTestRoom);
indexRoute.get("/test-room/get", getTestRoom);
indexRoute.delete("/test-room/del", delTestRoom);
indexRoute.put("/test-room/edit", editTestRoom);

indexRoute.post("/history", addHistory);
indexRoute.get("/history/get", getHistory);
indexRoute.delete("/history/del", delTestRoom);
indexRoute.put("/history/edit", editTestRoom);
indexRoute.get("/history/unsubmit", getUnSubmit);
indexRoute.get("/get-attempt", getAttempt);
indexRoute.post("/start-exam", startAttempt);

indexRoute.get("/exam/get", getExam);
indexRoute.post("/exam/get-contineu", getContineu);
indexRoute.post("/exam/submit", submitExam);
indexRoute.post("/exam/close-tab", closeTab);
indexRoute.post("/exam/submit-current", submitCurrent);

indexRoute.get("/member/info", getUserByEmail);
indexRoute.post("/testlink", upload.single("upload_file"), testLayout);

indexRoute.get("/hello", (req, res) => {
  res.send("hus hus");
});

module.exports = indexRoute;
