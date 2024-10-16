const { sendMail } = require("../utils/mail_controller");

const sendEmail = async (user, status) => {
  try {
    let subject = "";
    let message = "";
    let response;
    switch (status) {
      case "verification-code":
        subject = "Kwanza verification code";
        message =
          "Hi! " +
          user.name +
          ",<br>Your verification code is " +
          user.password;
        response = await sendMail(user, subject, message, status);
        break;
      default:
        break;
    }
    return response;
  } catch (error) {
    return error;
  }
};

module.exports = { sendEmail };
