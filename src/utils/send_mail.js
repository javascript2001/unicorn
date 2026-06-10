import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config({
  path: '../../.env'
})
  ;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});



const send_mail = async (tomail, token, baseurl) => {
  console.log(process.env.MAIL_USER)
  if (!tomail || !token || !baseurl) {
    return new Error("sender mail, token, and url are required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Verify Your Account" <otpverify1979@gmail.com>',
      to: tomail,
      subject: "Verify your email",
      text: `${baseurl}?token=${token}`, // plain‑text body
      html: `<b>Verify your email by clicking the link below</b> <br> <b>URL: <a href="${baseurl}?token=${token}">Verify Email</a></b>`, // HTML body
    });
  } catch (err) {
    console.log("Unable to send mail : ", err);

  }
}

const send_verify_success_mail = async (tomail) => {
  if (!tomail) {
    return new Error("sender mail is required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Account Verified Successfully" <otpverify1979@gmail.com>',
      to: tomail,
      subject: "Account Verified Successfully",
      text: "Your account has been verified successfully.",
      html: "<b>Your account has been verified successfully.</b>",
    });
  } catch (err) {
    console.log("Unable to send verification success mail : ", err);
  }
}

export { send_mail, send_verify_success_mail };