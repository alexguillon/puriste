import { startGame } from './quizz.services.js';

function startQuizzRoute() {
    return {
        method: 'POST',
        path: '/start',
        schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                mode: { type: 'string' },
                artist: { type: 'string' },
            },
            required: ['username', 'mode', 'artist'],
        },
        },
        handler: async (request) => {
            const { session } = request;
            const { username, mode, artist } = request.body;
            const result = await startGame({ session, username, mode, artist });
            return result;
        },
    };
}

export { startQuizzRoute };