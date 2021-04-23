const spotifyService = require("./spotifyServices");
const mathsUtils = require("../utils/mathsUtils");
const { SINGLE_TYPE } = require('../utils/quizzConstants');

exports.startGame = async (session, username, mode, artist) => {
  try { // we initialize a new session
    if(session.endGame){
      delete session.endGame;
    }
    session.username = username;
    session.points = "0";
    session.mode = mode;
    session.artist = artist;
    session.trackAlreadyAsked = [];
    return { username, artist, points: session.points };
  } catch(e){
    throw e;
  }
}

exports.getQuestion = async (session) => { // pick a random album, then a random song in the album
  try {
    let albums = await spotifyService.getAlbums(session.artist);
    if(albums.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomAlbum = pickRandomElement(albums.data.items);
    let albumTracks = await spotifyService.getAlbumTracklist(randomAlbum.id);
    if(albumTracks.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomTrack = pickRandomElement(albumTracks.data.items);
    let trackInfo = await spotifyService.getTrack(randomTrack.id); // get informations about the track we picked randomly
    while(trackInfo.status == 200 && session.trackAlreadyAsked.includes(trackInfo.data.id)){ // while we already asked the track to the user
      trackInfo = await spotifyService.getTrack(randomTrack.id);
    } 
    let trackFormattedInfo = getFormattedTrackQuestion(trackInfo.data);
    session.trackAlreadyAsked.push(trackFormattedInfo.id); // update redis session management object 
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

getTopTracks = async artist => {
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

pickRandomElement = array => {
  let random = mathsUtils.getRandomInt(array.length);
  return array[random];
}

getFormattedTrackQuestion = track => {
  let trackObject = {};
  trackObject.artist = "";
  track.artists.forEach((artist, index) => {
    trackObject.artist += (index > 0) ? ", " + artist.name : artist.name;
  });
  trackObject.name = track.name;
  trackObject.id = track.id;
  if(track.preview_url){ //sometimes we don't have a preview url
    trackObject.preview = track.preview_url;
  }
  trackObject.type = track.album.album_type;
  if(trackObject.type !== SINGLE_TYPE){
    trackObject.album = track.album.name;
  }
  return trackObject;
}

getTrackAnswer = track => (track.album.release_date ? new Date(track.album.release_date).getFullYear() : undefined);

checkAnswer = (session, year) => {
  let returnedObject = {};
  if(session.currentYearAnswer === year){
    session.points = (parseInt(session.points) + 1).toString(); // + 1 point
    returnedObject.answer = true;
  }else{ // we end the game by adding a new session parameter for future API call
    session.endGame = true;
    delete session.trackAlreadyAsked;
    returnedObject.answer = false;
  }
  returnedObject.points = parseInt(session.points);
  returnedObject.release_year = session.currentYearAnswer;
  return returnedObject;
}