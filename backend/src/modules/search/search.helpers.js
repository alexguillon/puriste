import _ from 'lodash';


export function getFormattedArtistslistAnswer(results) {
    const artists = _.get(results, 'artists');
    const artistsItem = _.get(artists, 'items');
    return  {
        total: _.get(artists, 'total'),
        artists: getFormattedArtistsItem(artistsItem)
    }
}

function getFormattedArtistsItem(artistsItem){
    let formattedArtists = [];
    artistsItem.forEach(artist => {
        formattedArtists.push({
            id: _.get(artist, 'id'),
            name: _.get(artist, 'name'),
            followers: _.get(artist, 'followers.total'),
            ...(artist.images[0] && { imageUrl: artist.images[0].url }),
        })
    });
    return formattedArtists;
}