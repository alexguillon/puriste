const { getQuestion, startGame, answer } = require('../services/quizzServices');
const dotenv = require('dotenv').config();

test('new quizz initialization', async () => {
    let session = {};
    let username = "test";
    let mode = "GUESS_YEAR";
    let artist = "3CnCGFxXbOA8bAK54jR8js";
    const start = await startGame(session, username, mode, artist);
    expect(start).toEqual(
        expect.objectContaining({
            artist: artist,
            username: username,
            points : "0"
        })
    );
});

test('question contains artist, id, song name and type', async () => {
    let session = {};
    session.artist = "3CnCGFxXbOA8bAK54jR8js";
    session.trackAlreadyAsked = [];
    const question = await getQuestion(session);
    expect(question).toEqual(
        expect.objectContaining({
            artist: expect.any(String),
            id: expect.any(String),
            name: expect.any(String),
            type: expect.any(String),
        })
    );
});

test('question artist contains Queen', async () => {
    let session = {};
    session.artist = "1dfeR4HaWDbWqFHLkxsg1d";
    session.trackAlreadyAsked = [];
    const question = await getQuestion(session);
    expect(question).toEqual(
        expect.objectContaining({
            artist: expect.stringMatching(/^(.*)Queen(.*)$/),
        })
    );
});

test('Bohemian Rhapsody (1975) - right answer', async () => {
    let session = {};
    session.artist = "1dfeR4HaWDbWqFHLkxsg1d";
    session.currentQuestion = "4u7EnebtmKWzUH433cf5Qv";
    session.currentYearAnswer = "1975";
    session.points = "2";
    let songID = "4u7EnebtmKWzUH433cf5Qv";
    let year = "1975";
    const getAnswer = await answer(session, songID, year);
    expect(getAnswer).toEqual({
            answer: true,
            points: 3,
            release_year: "1975"
    });
});

test('Don\'t stop me now (1978) - wrong answer', async () => {
    let session = {};
    session.artist = "1dfeR4HaWDbWqFHLkxsg1d";
    session.currentQuestion = "5T8EDUDqKcs6OSOwEsfqG7";
    session.currentYearAnswer = "1978";
    session.points = "2";
    let songID = "5T8EDUDqKcs6OSOwEsfqG7";
    let year = "1977";
    const getAnswer = await answer(session, songID, year);
    expect(getAnswer).not.toEqual({
            answer: true,
    });
    expect(getAnswer).toEqual({
        answer: false,
        points: 2,
        release_year: "1978"
    });
});