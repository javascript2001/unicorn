import { Queue } from 'bullmq';
import {redisConnection} from '../redis/conncetion.js';

const verifyMailQueue = new Queue('verify-mail-queue', { connection: redisConnection });
const verifySuccessQueue = new Queue('verify-success-queue', { connection: redisConnection });
const forgotPasswordQueue = new Queue('forgot-password-queue', {connection: redisConnection});
const passwordChangeQueue = new Queue('change-password-queue', {connection: redisConnection});
const twoFactorEnableDisableQueue= new Queue('enable-disable-queue', {connection: redisConnection})
const sendOtpQueue = new Queue('send-otp-queue', {connection: redisConnection});

export { verifyMailQueue, verifySuccessQueue, forgotPasswordQueue, passwordChangeQueue, twoFactorEnableDisableQueue, sendOtpQueue };