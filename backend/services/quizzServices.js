const spotifyService = require("./spotifyServices");
const mathsUtils = require("../utils/mathsUtils");

exports.launchNewQuizz = async (artist) => {
  try {
    let albums = await spotifyService.getAlbums(artist);
    if(albums.status != 200){
      throw "Spotify " + albums.message;
    }
    let randomAlbum = pickRandomElement(albums.data.items);
    let albumTracks = await spotifyService.getAlbumTracklist(randomAlbum.id);
    let randomTrack = pickRandomElement(albumTracks.data.items);
    let trackInfo = await spotifyService.getTrack(randomTrack.id);
    let trackFormattedInfo = getFormattedTrack(trackInfo.data);
    return trackFormattedInfo;
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
      let trackObject = getFormattedTrack(track);
      tracks.push(trackObject);
    });
    return tracks;
}

function pickRandomElement(array){
  let random = mathsUtils.getRandomInt(array.length);
  return array[random];
}

function getFormattedTrack(track){
  let trackObject = {};
  trackObject.artist = "";
  track.artists.forEach((artist, index) => {
    trackObject.artist += (index > 0) ? ", " + artist.name : artist.name;
  });
  trackObject.name = track.name;
  trackObject.release_date = track.album.release_date;
  return trackObject;
}