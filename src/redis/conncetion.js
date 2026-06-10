import dotenv from "dotenv";
dotenv.config();
import { Redis } from "ioredis"

export const redisConnection = new Redis({
        host: "localhost",
        port: 6379
},
{
        maxRetriesPerRequest: null,
        // host: "",
        // port: 6379,
});