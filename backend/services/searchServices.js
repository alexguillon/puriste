const spotifyService = require("./spotifyServices");

exports.searchArtist = async (name, offset) => {
  try {
    let spotifyOffset = offset*5; // we want artists results by series of 5
    let results = await spotifyService.searchArtist(name, spotifyOffset);
    let response = getFormattedSearchlistAnswer(results); // get a formatted answer from spotify results
    return response;
  } catch(e) {
    throw new Error(e.message)
  }
}

getFormattedSearchlistAnswer = results => {
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