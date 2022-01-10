import { getRandomInt } from './mathsUtils.js';
import { SINGLE_TYPE } from './quizzConstants.js';

export function getFormattedTrackQuestion(track) {
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
  
export function getTrackAnswer(track){
  return track.album.release_date ? new Date(track.album.release_date).getFullYear() : undefined; 
}

export function pickRandomElement(array) {
    let random = getRandomInt(array.length);
    return array[random];
}