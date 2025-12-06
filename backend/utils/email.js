const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // o tu proveedor
    auth: {
      user: "cesar.jimenez.20xx@gmail.com",
      pass: "kkqw kvvd lsuq ldxr",
    },
  });

  await transporter.sendMail({
    from: '"Soporte UTA" <TU_CORREO@gmail.com>',
    to,
    subject,
    text,
  });
}

module.exports = sendEmail;
