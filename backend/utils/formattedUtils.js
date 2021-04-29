const mathsUtils = require("../utils/mathsUtils");
const { SINGLE_TYPE } = require('../utils/quizzConstants');

exports.getFormattedArtistslistAnswer = results => {
    let response = {};
    response.total = results.artists.total;
    response.artists = [];
    results.artists.items.forEach(artist => {
        let object = {};
        object.id = artist.id;
        object.imageUrl = artist.images[0] ? artist.images[0].url : null;
        object.name = artist.name;
        object.followers = artist.followers.total;
        response.artists.push(object);
    });
    return response;
  }

exports.getFormattedTrackQuestion = track => {
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
  
exports.getTrackAnswer = track => (track.album.release_date ? new Date(track.album.release_date).getFullYear() : undefined);

exports.pickRandomElement = array => {
    let random = mathsUtils.getRandomInt(array.length);
    return array[random];
}
