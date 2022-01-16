import plugin from 'fastify-plugin';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';
import rateLimit from 'fastify-rate-limit';
import cookie from 'fastify-cookie';
import sensible from 'fastify-sensible';
import Redis from 'ioredis';
import session from '@mgcrea/fastify-session';
import sessionRedisStore from '@mgcrea/fastify-session-redis-store';

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
    instance.register(session, {
        secret: process.env.REDIS_CLIENT_SECRET,
        store: new RedisStore({ client: new Redis(process.env.REDIS_URI), ttl: process.env.REDIS_TTL }),
        cookie: {
            maxAge: process.env.REDIS_TTL,
        }
    });
    return instance;
});