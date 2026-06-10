import {Worker} from "bullmq"
import {send_mail, send_verify_success_mail} from "../utils/send_mail.js"
import {redisConnection} from '../redis/conncetion.js'

const send_mail_worker = new Worker('verify-mail-queue', async (job) => {
    // if (job.name === 'verify-mail') {
        const { token, mail } = job.data;
        const baseurl = "http://localhost:3000/api/v1/auth/verify";
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


export {send_mail_worker, send_mail_verify_success}