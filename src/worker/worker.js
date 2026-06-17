import { send_mail_worker, send_mail_verify_success, send_forgot_password_mail_worker, send_change_password_mail_worker, send_enable_disable_2fa_mail_worker, send_otp_mail_worker } from "./send_mail_worker.js";


function init() {
    console.log("Running worker");
    send_mail_worker.run();
    send_mail_verify_success.run();
    send_forgot_password_mail_worker.run();
    send_change_password_mail_worker.run();
    send_enable_disable_2fa_mail_worker.run();
    send_otp_mail_worker.run();
}


init()