const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // o tu proveedor
    auth: {
      user: "cesar.jimenez.20xx@gmail.com",
      pass: "ansd yoya jawt kgus",
    },
  });

  await transporter.sendMail({
    from: '"Gestión UTA" <TU_CORREO@gmail.com>',
    to,
    subject,
    text,
  });
}

module.exports = sendEmail;
