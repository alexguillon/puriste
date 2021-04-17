const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const session = require('express-session');
const connectRedis = require('connect-redis');
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');
const searchRoutes = require('./routes/searchRoutes');
const quizzRoutes = require('./routes/quizzRoutes');
const dotenv = require('dotenv').config();

const AppError = require('./utils/appError');
const app = express();

const RedisStore = connectRedis(session)//Configure redis client

//Configure session middleware
app.use(session({
    secret: process.env.REDIS_CLIENT_SECRET,
    store: new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}));

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(cookieParser());

// Routes
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/quizz', quizzRoutes);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});



module.exports = app;