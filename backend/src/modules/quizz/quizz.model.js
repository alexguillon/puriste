import _ from 'lodash';

export function formatStartGamePayload({ username, mode, artist }) {
    return {
        username,
        points: 0,
        mode,
        artist,
        trackAlreadyAsked: [],
    }
}