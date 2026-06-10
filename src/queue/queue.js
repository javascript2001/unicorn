import { Queue } from 'bullmq';
import {redisConnection} from '../redis/conncetion.js';

const verifyMailQueue = new Queue('verify-mail-queue', { connection: redisConnection });
const verifySuccessQueue = new Queue('verify-success-queue', { connection: redisConnection });

export { verifyMailQueue, verifySuccessQueue };