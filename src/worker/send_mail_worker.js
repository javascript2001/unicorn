import {Worker} from "bullmq"
import {send_mail, send_verify_success_mail, enable_disable_2fa_mail, send_change_password_mail, send_forgot_password_mail, send_otp_mail} from "../utils/send_mail.js"
import {redisConnection} from '../redis/conncetion.js'

const send_mail_worker = new Worker('verify-mail-queue', async (job) => {
    // if (job.name === 'verify-mail') {
        const { token, mail } = job.data;
        const baseurl = process.env.MAIL_VERIFY_BASE_URL;
        console.log("sending mail to :", mail);
        await send_mail(mail, token, baseurl);
        console.log("mail sent to :", mail);
    // }       
},  {
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
});


const send_mail_verify_success = new Worker('verify-success-queue', async (job) => {
    const { mail } = job.data;
    if (!mail) {
        console.log("Mail is required to send verification success mail.");
        return;
    }
    console.log("Verification successful for :", mail);
    await send_verify_success_mail(mail);
    console.log("Verification success mail sent to :", mail);
},  {
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
});


const send_forgot_password_mail_worker = new Worker('forgot-password-queue', async (job) => {
    try {
        if (!job.data) {
            console.log("Job data is required to send forgot password mail.");
            return;
        }
    const { token, mail } = job.data;
    console.log("Sending forgot password mail to :", mail);
    await send_forgot_password_mail(mail, token);
    console.log("Forgot password mail sent to :", mail);
    } catch (err) {
        console.log("Error in sending forgot password mail : ", err);
    }
}, 
{
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
}
)


const send_change_password_mail_worker = new Worker('change-password-queue', async (job) => {
    try {
        if (!job.data) {    
            console.log("Job data is required to send change password mail.");
            return;
        }
    const { mail } = job.data;
    console.log("Sending change password mail to :", mail);
    await send_change_password_mail(mail);
    console.log("Change password mail sent to :", mail);
    } catch (err) {
        console.log("Error in sending change password mail : ", err);
    }
},
{
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
}
)

const send_enable_disable_2fa_mail_worker = new Worker('enable-disable-queue', async (job) => {
    try {
        if (!job.data) {
            console.log("Job data is required to send enable/disable 2fa mail.");
            return;
        }
    const { mail, status } = job.data;
    console.log("Sending enable/disable 2fa mail to :", mail, "Status :", status);
    await enable_disable_2fa_mail(mail, status);
    console.log("enable/disable 2fa mail sent to :", mail, "Status :", status);
     } catch (err) {
        console.log("Error in sending enable/disable 2fa mail : ", err);
    }
},
{
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
}
)

const send_otp_mail_worker = new Worker('send-otp-queue', async (job) => {
    try {
        if (!job.data) {
            console.log("Job data is required to send OTP mail.");
            return;
        }
    const { mail } = job.data;
    console.log("Sending OTP mail to :", mail);
    await send_otp_mail(mail);
    console.log("OTP mail sent to :", mail);
     } catch (err) {
        console.log("Error in sending OTP mail : ", err);
    }
},
{
    autorun: false,
    connection: redisConnection,
    concurrency: 5,
    limiter: {
        duration: 10 * 5,
        max: 5
    },
}

)

export {send_mail_worker, send_mail_verify_success, send_forgot_password_mail_worker, send_change_password_mail_worker, send_enable_disable_2fa_mail_worker, send_otp_mail_worker};