import { startGame } from './quizz.services.js';
import { validateSession } from './quizz.handler.js';
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
        handler: async function(request, reply)  {
            const { session, body } = request;
            try {
                const playerSessionData = _.get(session.data, session.id);
                validateSession(playerSessionData);
            }catch(error){
                reply.code(400).send(error);
            }
            const { username, mode, artist } = body;
            const result = await startGame({ session, username, mode, artist });
            return result;
        },
    };
}

export { startQuizzRoute };