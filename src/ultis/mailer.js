var nodemailer = require("nodemailer");
require("dotenv").config();
const sendEmail = function (data) {
  var transporter = nodemailer.createTransport({
    // config mail server
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "hongson19072003@gmail.com",
    to: "hongson19072002@gmail.com",
    subject: "Test Nodemailer",
    text: "You recieved message from " + "something",
    html:
      "<p>You have got a new message</b><ul><li>Username:" +
      "something" +
      "</li><li>Email:" +
      "email name" +
      "</li><li>Username:" +
      "email message" +
      "</li></ul>",
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
// khai báo sử dụng module nodemailer
module.exports = sendEmail;
