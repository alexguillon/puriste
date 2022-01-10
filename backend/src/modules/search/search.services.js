import { searchArtist, searchTracks } from "../../services/spotify.services.js"
import { getFormattedTrackQuestion } from '../../utils/formattedUtils.js';
import { getFormattedArtistslistAnswer } from './search.helpers.js';

export async function searchArtistName({ name, offset = 0 }) {
  try {
    let spotifyOffset = offset*5; // we want artists results by series of 5
    let results = await searchArtist(name, spotifyOffset);
    let response = getFormattedArtistslistAnswer(results); // get a formatted answer from spotify results
    return response;
  } catch(e) {
    throw new Error(e.message)
  }
}

// https://medium.com/@wrj111/recursive-promises-in-nodejs-769d0e4c0cf9
export async function searchTrackPool({ name, pool = 10 }) {
  const trackItems = [];
  if(pool < 1 || pool > 1000){ // pool value verification
    throw new Error('Pool value must be between 1 and 1000.');
  }
  const searchLimitOffset = async (offset, pool) => {
    if(pool > 50) {// spotify limits the number of results at 50 for each request
      return searchTracks(name, offset, 50).then(tracks => {
        trackItems.push(...tracks.tracks.items);
        // if the list retrieved is below 50, then we can directly send the final answer to avoid useless next call to the Spotify API
        return tracks.tracks.items.length == 50 ? searchLimitOffset(offset+50, pool-50) : trackItems; // asynchronous recursivity to fetch next results 
      }).catch(err => {
        throw new Error('Error while retrieving tracks : ' + err);
      });
    }else{
      return searchTracks(name, offset, pool).then(tracks => {
        trackItems.push(...tracks.tracks.items);
        return trackItems; // final iteration where the number of results asked is below 50
      }).catch(err => {
        throw new Error('Error while retrieving tracks : ' + err);
      });
    }
  };
  const tracksResult = await searchLimitOffset(0, pool); // get the tracks
  return {
    size: tracksResult.length, // length of the tracks retrieved
    tracks: tracksResult.map((track, index) => {
      return {
        page: Math.trunc(index/50) + 1, // 1 page contains 50 tracks
        ...getFormattedTrackQuestion(track)
      };
    })
  }
};


