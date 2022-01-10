import plugin from 'fastify-plugin';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';
import rateLimit from 'fastify-rate-limit';
import cookie from 'fastify-cookie';
import sensible from 'fastify-sensible';
import redis from 'fastify-redis';
import { redisClient } from '../../config/redis.js';
import session from '@mgcrea/fastify-session';
import sessionRedisStore from '@mgcrea/fastify-session-redis-store';

import dotenv from 'dotenv';

dotenv.config();

export default plugin(async (instance) => {
    const { RedisStore } = sessionRedisStore;
    instance.register(helmet);
    instance.register(cors);
    instance.register(sensible, { errorHandler: false });
    instance.register(rateLimit, {
        max: 150,
        windowMs: 60 * 60 * 1000,
        message: 'Too Many Request from this IP, please try again in an hour'
    });
    instance.register(cookie);
    instance.register(redis, {
        client: redisClient
    });
    instance.register(session, {
        secret: process.env.REDIS_CLIENT_SECRET,
        store: new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient}),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 10 // session max age in miliseconds
        }
    });
    return instance;
});