import { searchArtistName, searchTrackPool } from './search.services.js';

function searchArtistRoute() {
    return {
        method: 'GET',
        path: '/artist',
        schema: {
        querystring: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                offset: { type: 'number', minimum: 0 },
            },
            required: ['name'],
        },
        },
        handler: async (request) => {
        
        const { name, offset } = request.query;
        const result = await searchArtistName({ name, offset });
        return result;
        },
    };
}

function searchTracksRoute() {
    return {
        method: 'GET',
        path: '/tracks',
        schema: {
        querystring: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                pool: { type: 'number', minimum: 0, maximum: 1000 },
            },
            required: ['name'],
        },
        },
        handler: async (request) => {
        const { name, pool } = request.query;
        const result = await searchTrackPool({ name, pool });
        return result;
        },
    };
}


export { searchArtistRoute, searchTracksRoute };