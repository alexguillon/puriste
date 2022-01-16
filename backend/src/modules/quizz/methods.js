import { startGame, getQuestion, answer } from './quizz.services.js';
import { validateSession, validateQuizzSession } from './quizz.handler.js';
import { GAME_MODE } from './quizz.constants.js';
import _ from 'lodash';

function startQuizzRoute() {
    return {
        method: 'POST',
        path: '/start',
        schema: {
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    mode: { type: 'string', enum: GAME_MODE },
                    artist: { type: 'string' },
                },
                required: ['username', 'mode', 'artist'],
            },
        },
        preValidation: async (request, reply) => {
            const { session } = request;
            try {
                const playerSession = _.get(session.data, session.id);
                validateSession(playerSession);
            }catch(error){
                reply.code(400).send(error);
            }
        },
        handler: async (request) => {
            const { session, body } = request;
            const { username, mode, artist } = body;
            const result = await startGame({ session, username, mode, artist });
            return result;
        },
    };
}

function askQuizzRoute() {
    return {
        method: 'GET',
        path: '/ask',
        preValidation: async (request, reply) => {
            const { session } = request;
            try {
                console.log(session);
                const { username, endGame, currentQuestion } = _.get(session.data, session.id);
                validateQuizzSession({ username, endGame, currentQuestion });
            }catch(error){
                reply.code(400).send(error);
            }
        },
        handler: async (request) =>  {
            const { session } = request;
            const playerSession = _.get(session.data, session.id);
            const result = await getQuestion({ session, playerSession });
            return result;
        },
    };
}

function answerQuizzRoute() {
    return {
        method: 'POST',
        path: '/answer',
        schema: {
            body: {
                type: 'object',
                properties: {
                    songID: { type: 'string' },
                    year: { type: 'number' },
                },
                required: ['songID', 'year'],
            },
        },
        preValidation: async (request, reply) => {
            const { session } = request;
            try {
                const playerSession = _.get(session.data, session.id);
                const { username, endGame } = playerSession;
                validateQuizzSession({ username, endGame });
            }catch(error){
                reply.code(400).send(error);
            }
        },
        handler: async (request) => {
            const { session, body } = request;
            const playerSession = _.get(session.data, session.id);
            const { songID, year } = body;
            const result = await answer({ session, playerSession, songID, year });
            return result;
        },
    };
}

export { startQuizzRoute, askQuizzRoute, answerQuizzRoute };