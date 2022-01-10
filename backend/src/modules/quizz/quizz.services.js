import { getAlbums, getAlbumTracklist, getTrack, getTopSongs } from "../../services/spotify.services.js"
import { getFormattedTrackQuestion, getTrackAnswer, pickRandomElement } from '../../utils/formattedUtils.js';

export async function startGame({ session, username, mode, artist }){
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

export async function getQuestion(session){ // pick a random album, then a random song in the album
  try {
    let albums = await getAlbums(session.artist);
    if(albums.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomAlbum = pickRandomElement(albums.data.items);
    let albumTracks = await getAlbumTracklist(randomAlbum.id);
    if(albumTracks.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomTrack = pickRandomElement(albumTracks.data.items);
    let trackInfo = await getTrack(randomTrack.id); // get informations about the track we picked randomly
    while(trackInfo.status == 200 && session.trackAlreadyAsked.includes(trackInfo.data.id)){ // while we already asked the track to the user
      trackInfo = await getTrack(randomTrack.id);
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

export async function answer(session, songID, year){
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

const getTopTracks = async artist => {
  let mostPopularSongs = await getTopSongs(artist);
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


const checkAnswer = (session, year) => {
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