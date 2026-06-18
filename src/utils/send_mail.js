import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config({
  path: '../../.env'
});
import {Redis} from 'ioredis';

import { redisConnection } from '../redis/conncetion.js'


const redis = new Redis();

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
      from: '"Verify Your Account"',
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
      from: '"Account Verified Successfully"',
      to: tomail,
      subject: "Account Verified Successfully",
      text: "Your account has been verified successfully.",
      html: "<b>Your account has been verified successfully.</b>",
    });
  } catch (err) {
    console.log("Unable to send verification success mail : ", err);
  }
}

const send_forgot_password_mail = async (tomail, token) => {
  if (!tomail || !token) {
    return new Error("sender mail and token are required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Reset Your Password"',
      to: tomail,
      subject: "Reset your password",
      text: `${process.env.FORGOT_PASSWORD_BASE_URL}?token=${token}`, // plain‑text body
      html: `<b>Reset your password by clicking the link below</b> <br> <b>URL: <a href="${process.env.FORGOT_PASSWORD_BASE_URL}?token=${token}">Reset Password</a></b>`, // HTML body
    });
  } catch (err) {
    console.log("Unable to send forgot password mail : ", err);
  }
}

const send_change_password_mail = async (tomail) => {
  if (!tomail) {
    return new Error("sender mail is required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Password Changed Successfully"',
      to: tomail,
      subject: "Password Changed Successfully",
      text: "Your password has been changed successfully.",
      html: "<b>Your password has been changed successfully.</b>",
    });
  } catch (err) {
    console.log("Unable to send change password mail : ", err);
  }
}

const enable_disable_2fa_mail = async (tomail, status) => {
  if (!tomail || !status) {
    return new Error("sender mail and status are required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Two Factor Authentication Status Changed"',
      to: tomail,
      subject: "Two Factor Authentication Status Changed",
      text: `Your two factor authentication has been ${status} successfully.`,
      html: `<b>Your two factor authentication has been ${status} successfully.</b>`,
    });
  } catch (err) {
    console.log("Unable to send two factor authentication status mail : ", err);
  }
}


const send_otp_mail = async (tomail, otp) => {
  if (!tomail || !otp) {
    throw new Error("sender mail and otp are required")
  }
  try {
    const info = await transporter.sendMail({
      from: '"Your OTP Code"',
      to: tomail,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`, // plain‑text body
      html: `<b>Your OTP code is ${otp}. It will expire in 10 minutes.</b>`, // HTML body
    });
  } catch (err) {
    console.log("Unable to send OTP mail : ", err);
  }
}

export { send_mail, send_verify_success_mail, send_forgot_password_mail, send_change_password_mail, enable_disable_2fa_mail, send_otp_mail };