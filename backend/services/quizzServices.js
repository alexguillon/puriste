const spotifyService = require("./spotifyServices");
const mathsUtils = require("../utils/mathsUtils");
const { SINGLE_TYPE } = require('../utils/quizzConstants');

exports.startGame = async (session, username, mode, artist) => {
  try {
    if(session.endGame){
      delete session.endGame;
    }
    session.username = username;
    session.points = "0";
    session.mode = mode;
    session.artist = artist;
    let returnedObject = {};
    returnedObject.username = username;
    returnedObject.artist = artist;
    return returnedObject;
  } catch(e){
    throw e;
  }
}

exports.getQuestion = async (session) => {
  try {
    let albums = await spotifyService.getAlbums(session.artist);
    if(albums.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomAlbum = pickRandomElement(albums.data.items);
    let albumTracks = await spotifyService.getAlbumTracklist(randomAlbum.id);
    let randomTrack = pickRandomElement(albumTracks.data.items);
    let trackInfo = await spotifyService.getTrack(randomTrack.id);
    let trackFormattedInfo = getFormattedTrackQuestion(trackInfo.data);
    session.currentYearAnswer = getTrackAnswer(trackInfo.data);
    session.currentQuestion = trackFormattedInfo.id;
    return trackFormattedInfo;
  } catch(e) {
    throw e;
  }
}

exports.answer = async (session, songID, year) => {
  try {
    if(session.currentQuestion === songID){
      let returnedAnswer = checkAnswer(session, year);
      delete session.currentYearAnswer;
      delete session.currentQuestion;
      return returnedAnswer;
    }else{
      throw "There is a difference between the current question and the song id provided."
    }
  } catch(e) {
    throw e;
  }
}

async function getTopTracks(artist){
  let mostPopularSongs = await spotifyService.getTopSongs(artist);
    if(mostPopularSongs.status != 200){
      throw "Spotify " + mostPopularSongs.message;
    }
    let tracks = [];
    mostPopularSongs.data.tracks.forEach(track => {
      let trackObject = getFormattedTrackQuestion(track);
      tracks.push(trackObject);
    });
    return tracks;
}

function pickRandomElement(array){
  let random = mathsUtils.getRandomInt(array.length);
  return array[random];
}

function getFormattedTrackQuestion(track){
  let trackObject = {};
  trackObject.artist = "";
  track.artists.forEach((artist, index) => {
    trackObject.artist += (index > 0) ? ", " + artist.name : artist.name;
  });
  trackObject.name = track.name;
  trackObject.id = track.id;
  trackObject.preview = track.preview_url;
  trackObject.type = track.album.album_type;
  if(trackObject.type !== SINGLE_TYPE){
    trackObject.album = track.album.name;
  }
  return trackObject;
}

function getTrackAnswer(track){
  return track.album.release_date ? new Date(track.album.release_date).getFullYear() : undefined;
}

function checkAnswer(session, year){
  let returnedObject = {};
  if(session.currentYearAnswer === year){
    session.points = (parseInt(session.points) + 1).toString();
    returnedObject.answer = true;
  }else{
    session.endGame = true;
    returnedObject.answer = false;
  }
  returnedObject.points = parseInt(session.points);
  returnedObject.release_year = session.currentYearAnswer;
  return returnedObject;
}