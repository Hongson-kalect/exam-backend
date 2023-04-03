const sequelize = require("sequelize");
const Op = sequelize.Op;
const db = require("../sequelize/models");
const { checkValidUser } = require("../ultis/function");
const { getEmailByToken } = require("./global");
const subjectSevices = {
  getPermission: async (data) => {
    const email = await getEmailByToken(data.id);
    const subject = await getSubject(data.subjectId);
    if (subject?.host?.includes(email)) {
      return "host";
    } else if (subject?.deputy?.includes(email)) return "deputy";
    else {
      return "member";
    }
  },
  add: async (data) => {
    const email = await getEmailByToken(data.host);
    const result = await db.Subject.create({
      name: data.name,
      hash: data.hash,
      description: data.decribe,
      avatar: data.upload,
      host: email,
      member: email,
      gender: data.gender,
      allowSeeQuestion: false,
      allowSeeTest: false,
    });
    if (result) return true;
    else return false;
  },
  leaveRoom: async (data) => {
    const subjectRaw = await db.Subject.findOne({
      where: {
        id: Number(data.subjectId) || 0,
      },
    });
    const subject = subjectRaw?.dataValues || null;
    if (subject) {
      const email = await getEmailByToken(data.id);
      if (email) {
        if (subject.member.includes(email)) {
          const member = subject.member.replace("|" + email, "");
          await db.Subject.update(
            {
              member: member,
            },
            {
              where: {
                id: Number(data.subjectId) || 0,
              },
            }
          );
          return { status: 1, message: "Leave completed" };
        } else {
          return { status: 0, message: "You are not member of this room" };
        }
      } else {
        return { status: -1, message: "Email not found" };
      }
    } else return { status: -1, message: "Subject not exist" };
  },
  joinByHash: async (data) => {
    const subjectRaw = await db.Subject.findOne({
      where: {
        hash: data.hash,
      },
    });
    const subject = subjectRaw?.dataValues || null;
    if (subject) {
      const email = await getEmailByToken(data.id);
      if (subject.member.includes(email)) {
        return { status: 0, message: "You are already in this subject" };
      } else {
        const member = subject.member + "|" + email;
        await db.Subject.update(
          {
            member: member,
          },
          {
            where: {
              hash: data.hash,
            },
          }
        );
        return { status: 1, message: "Join success" };
      }
    } else return { status: -1, message: "Subject not exist" };
  },
  get: async (data) => {
    const email = await getEmailByToken(data.id);
    const result = await db.Subject.findAll({
      where: {
        member: {
          [Op.like]: `%${email}%`,
        },
      },
    });
    if (result) return result;
    else return false;
  },
  editSubject: async (data) => {
    const email = await getEmailByToken(data.id);
    const subject = await getSubject(data.subjectId);
    if (subject?.host?.includes(email) || subject?.deputy?.includes(email)) {
      const result = await db.Subject.update(
        {
          name: data.name,
          discription: data.description,
          allowSeeQuestion: data.allowSeeQuestion,
          allowSeeTest: data.allowSeeTest,
          avatar: data.avatar,
        },
        {
          where: {
            id: Number(data.subjectId) || 0,
          },
        }
      );
      return {
        status: 1,
        message: "edit success",
      };
    } else {
      return { status: 0, message: "You not have permittion on this task" };
    }
  },
  delSubject: async (data) => {
    const email = await getEmailByToken(data.id);
    const subject = await getSubject(data.subjectId);
    if (subject?.host?.includes(email)) {
      const result = await db.Subject.destroy({
        where: {
          id: Number(data.subjectId) || 0,
        },
      });
      return {
        status: 1,
        message: "Deleted success",
      };
    } else {
      return { status: 0, message: "You not have permittion on this task" };
    }
  },
  getInfo: async (data) => {
    const result = await db.Subject.findOne({
      where: {
        id: Number(data.id) || 0,
      },
    });
    if (result) return result;
    else return false;
  },
  getName: async (data) => {
    const result = await db.Subject.findOne({
      attributes: ["name"],
      where: {
        id: Number(data.id) || 0,
      },
    });
    if (result) return result;
    else return false;
  },
  getMember: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const result = await db.Subject.findOne({
        attributes: ["host", "deputy", "member"],
        where: {
          id: Number(data.subjectId) || 0,
        },
      });
      if (result.dataValues) {
        const deputy = result.dataValues.deputy?.split("|") || [];
        const member = result.dataValues.member?.split("|") || [];
        return {
          status: 1,
          data: { host: result.dataValues.host, deputy, member },
        };
      } else return { status: 1, message: "Member not found" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  searchMember: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      let userList = await db.User.findAll({
        attributes: ["avatar", "email", "firstName", "lastName"],
        where: {
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${data.search}%`,
              },
            },
            {
              firstName: {
                [Op.like]: `%${data.search}%`,
              },
            },
            {
              lastName: {
                [Op.like]: `%${data.search}%`,
              },
            },
          ],
        },
        raw: true,
      });
      let memberList = await db.Subject.findOne({
        attributes: ["member"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      console.log(memberList);
      memberList = memberList.member.split("|");
      userList = userList.filter((item) => {
        return !memberList.includes(item.email);
      });

      return { status: 1, data: userList };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  handleAddMember: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      let currentMember = await db.Subject.findOne({
        attributes: ["member"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      currentMember = currentMember.member;
      if (data.member) {
        for (let index = 0; index < data.member.length; index++) {
          if (currentMember.includes(data.member[index])) {
            continue;
          }
          currentMember += "|" + data.member[index];
        }
      }
      await db.Subject.update(
        {
          member: currentMember,
        },
        {
          where: {
            id: Number(data.subjectId) || 0,
          },
        }
      );
      return { status: 1, message: "Add member completed" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  makeHost: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      let subject = await db.Subject.findOne({
        attributes: ["member", "host", "deputy"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      let newHost = "";
      let newDeputy = "";
      if (email === subject.host) {
        newHost = data.email;
        //remove new host in deputy if it in
        console.log("|" + data.email);
        if (subject.deputy.includes("|" + data.email)) {
          newDeputy = subject.deputy.replace("|" + data.email, "");
        } else if (subject.deputy.includes(data.email + "|")) {
          newDeputy = subject.deputy.replace(data.email + "|", "");
        } else if (subject.deputy.includes(data.email)) {
          newDeputy = subject.deputy.replace(data.email, "");
        }

        //make old host to a deputy
        if (!subject.deputy) {
          newDeputy = email;
        } else {
          newDeputy = newDeputy + "|" + email;
        }
        console.log(newHost, newDeputy);
        await db.Subject.update(
          {
            host: newHost,
            deputy: newDeputy,
          },
          {
            where: {
              id: Number(data.subjectId) || 0,
            },
          }
        );
        return { status: 1, message: "Change success" };
      }

      return { status: 0, message: "NOT HOST" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  removeDeputy: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      let subject = await db.Subject.findOne({
        attributes: ["member", "host", "deputy"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      let newDeputy = "";
      if (email === subject.host) {
        if (subject.deputy.includes("|" + data.email)) {
          newDeputy = subject.deputy.replace("|" + data.email, "");
        } else if (subject.deputy.includes(data.email + "|")) {
          newDeputy = subject.deputy.replace(data.email + "|", "");
        } else {
          newDeputy = subject.deputy.replace(data.email, "");
        }
        await db.Subject.update(
          {
            deputy: newDeputy,
          },
          {
            where: {
              id: Number(data.subjectId) || 0,
            },
          }
        );
        return { status: 1, message: "Change success" };
      }

      return { status: 0, message: "NOT HOST" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  makeDeputy: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      let subject = await db.Subject.findOne({
        attributes: ["member", "host", "deputy"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      let newDeputy = "";
      if (email === subject.host) {
        if (!subject.deputy) {
          newDeputy = data.email;
        } else {
          newDeputy = subject.deputy + "|" + data.email;
        }
        await db.Subject.update(
          {
            deputy: newDeputy,
          },
          {
            where: {
              id: Number(data.subjectId) || 0,
            },
          }
        );
        return { status: 1, message: "Change success" };
      }

      return { status: 0, message: "NOT HOST" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
  kick: async (data) => {
    if (await checkValidUser(data.userId, data.subjectId)) {
      const email = await getEmailByToken(data.userId);
      let subject = await db.Subject.findOne({
        attributes: ["member", "host", "deputy"],
        where: {
          id: Number(data.subjectId) || 0,
        },
        raw: true,
      });
      let newMember = "";
      let newDeputy = "";
      if (email === subject.host || subject.deputy.includes(email)) {
        if (subject.member.includes("|" + data.email)) {
          newMember = subject.member.replace("|" + data.email, "");
        } else if (subject.member.includes(data.email + "|")) {
          newMember = subject.member.replace(data.email + "|", "");
        } else {
          newMember = subject.member.replace(data.email, "");
        }
        if (subject.deputy.includes("|" + data.email)) {
          newMember = subject.deputy.replace("|" + data.email, "");
        } else if (subject.deputy.includes(data.email + "|")) {
          newMember = subject.deputy.replace(data.email + "|", "");
        } else {
          newMember = subject.deputy.replace(data.email, "");
        }
        await db.Subject.update(
          {
            member: newMember,
          },
          {
            where: {
              id: Number(data.subjectId) || 0,
            },
          }
        );
        return { status: 1, message: "Change success" };
      }

      return { status: 0, message: "NOT HOST OR DEPUTY" };
    } else
      return { status: -1, message: "You not have permisson to do this task" };
  },
};
const getSubject = async (id) => {
  const result = await db.Subject.findOne({
    where: {
      id: Number(id) || 0,
    },
  });
  return result.dataValues;
};
module.exports = subjectSevices;
