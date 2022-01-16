import { getAlbums, getAlbumTracklist, getTrack, getTopSongs } from "../../services/spotify.services.js";
import { formatStartGamePayload } from './quizz.model.js';
import { getFormattedTrackQuestion, getTrackAnswer, pickRandomElement } from '../../utils/formattedUtils.js';
import _ from 'lodash';

export async function startGame({ session, username, mode, artist }){
  try {
    const { id: playerSessionId } = session;
    const playerStartGamePayload = formatStartGamePayload({ username, mode, artist });
    session.set(playerSessionId, playerStartGamePayload);
    return { ...playerStartGamePayload };
  } catch(error){
    throw error;
  }
}

export async function getQuestion({ session, playerSession }){ // pick a random album, then a random song in the album
  try {
    const { id: playerSessionId } = playerSession;
    const albums = await getAlbums(playerSession.artist);
    const { status, message } = albums;
    if(!_.isEqual(status, 200)) {
      throw "Spotify " + message;
    }
    const pickRandomAlbum = pickRandomElement(albums.data.items);
    const albumTracks = await getAlbumTracklist(pickRandomAlbum.id);
    if(!_.isEqual(albumTracks.status, 200)){
      throw "Spotify " + albumTracks.message;
    }
    const randomTrack = pickRandomElement(albumTracks.data.items);
    let trackInfo = await getTrack(randomTrack.id); // get informations about the track we picked randomly
    while(_.isEqual(trackInfo.status, 200) && playerSession.trackAlreadyAsked.includes(trackInfo.data.id)){ // while we already asked the track to the user
      trackInfo = await getTrack(randomTrack.id);
    } 
    const trackFormattedInfo = getFormattedTrackQuestion(trackInfo.data);
    playerSession.trackAlreadyAsked.push(trackFormattedInfo.id); // update redis session management object 
    playerSession.currentYearAnswer = getTrackAnswer(trackInfo.data);
    playerSession.currentQuestion = trackFormattedInfo.id;
    session.set(playerSessionId, playerSession);
    return trackFormattedInfo;
  } catch(e) {
    throw e;
  }
}

export async function answer({ session, playerSession, songID, year }){
  try {
    const { id: playerSessionId } = playerSession;
    if(playerSession.currentQuestion === songID){
      let returnedAnswer = checkAnswer(playerSession, year);
      delete playerSession.currentYearAnswer;
      delete playerSession.currentQuestion;
      session.set(playerSessionId, playerSession);
      return returnedAnswer;
    }else{
      throw "There is a difference between the current question and the song id provided."
    }
  } catch(error) {
    throw error;
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
    session.points = session.points + 1; // + 1 point
    returnedObject.answer = true;
  }else{ // we end the game by adding a new session parameter for future API call
    session.endGame = true;
    delete session.trackAlreadyAsked;
    returnedObject.answer = false;
  }
  returnedObject.points = session.points;
  returnedObject.release_year = session.currentYearAnswer;
  return returnedObject;
}