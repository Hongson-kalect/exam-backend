const db = require("../sequelize/models");
const { getEmailByToken } = require("../services/global");

function makeArray(array, number) {
  tempArr = [0];
  loopArr = [...array];
  for (var i = loopArr.length - 2; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1) + 1);
    tempArr.push(array.indexOf(loopArr[j]));
    loopArr.splice(j, 1);
    if (number === tempArr.length) return tempArr;
  }
  return tempArr;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const checkValidUser = async (userToken, subjectId) => {
  email = (await getEmailByToken(userToken)) || "|||";
  const subjectRaw = await db.Subject.findOne({
    where: {
      id: Number(subjectId),
    },
  });
  const subject = subjectRaw?.dataValues || null;
  if (subject?.member.includes(email) || false) {
    console.log("aaa");
    return true;
  } else {
    return false;
  }
};

const checkScore = (anser, userAnserCharacter) => {
  const userAnser = changeAnserToNumber(userAnserCharacter);
  let questionArray = anser.split("|");
  let correct = 0;
  questionArray = questionArray.filter((item) => item !== "");
  for (let index = 0; index < questionArray.length; index++) {
    anserArr = questionArray[index].split("-").filter((item) => item !== "");
    if (anserArr[Number(userAnser[index]) + 1] === "0") {
      correct++;
    }
  }
  return { correct, total: questionArray.length };
};
const getUserScore = async (userAnserString, testId) => {
  let correct = 0;
  let total = 0;
  userAnserArr = userAnserString.split("|");
  const getTest = await db.Test.findOne({
    attributes: ["question"],
    where: {
      id: Number(testId) || 0,
    },
    raw: true,
  });
  const questionHash = getTest.question;
  const questionArr = questionHash.split("|");
  console.log(questionArr);
  total = questionArr.length;
  for (let index = 0; index < total; index++) {
    anserList = questionArr[index].split("-");
    console.log(anserList);
    console.log(userAnserArr[index]);
    console.log(correct);

    switch (userAnserArr[index]) {
      case "a":
        if (anserList[1] === "0") correct++;
        break;

      case "b":
        if (anserList[2] === "0") correct++;
        break;

      case "c":
        if (anserList[3] === "0") correct++;
        break;

      case "d":
        if (anserList[4] === "0") correct++;
        break;

      default:
        break;
    }
  }
  return { correct, total };
};
const changeAnserToNumber = (userAnserArr) => {
  const numberArr = [];
  for (let index = 0; index < userAnserArr.length; index++) {
    switch (userAnserArr[index]) {
      case "a":
        numberArr.push(0);
        break;
      case "b":
        numberArr.push(1);
        break;
      case "c":
        numberArr.push(2);
        break;
      case "d":
        numberArr.push(3);
        break;

      default:
        numberArr.push("null");
        break;
    }
  }
  return numberArr;
};
module.exports = {
  shuffleArray,
  getUserScore,
  makeArray,
  checkValidUser,
  checkScore,
  changeAnserToNumber,
};
