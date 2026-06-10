import { send_mail_worker, send_mail_verify_success } from "./send_mail_worker.js";


function init() {
    console.log("Running worker");
    send_mail_worker.run();
    send_mail_verify_success.run();
}


init()