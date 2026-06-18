import dotenv from "dotenv";
dotenv.config({
        path: '../../.env'
});
import { Redis } from "ioredis"

export const redisConnection = new Redis({
        host: "valkey",
        port: 6379
},
{
        maxRetriesPerRequest: null
});

export const redisOption = {
        host: "valkey",
        port: 6379
}