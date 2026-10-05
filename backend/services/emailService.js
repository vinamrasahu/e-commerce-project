import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
    html,
  });
};

