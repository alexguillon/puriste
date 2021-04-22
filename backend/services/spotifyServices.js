const axios = require('axios');
const qs = require('qs');
const btoa = require('btoa');
const NodeCache = require( "node-cache" );
const spotifyCache = new NodeCache( { stdTTL: 3480, checkperiod: 3600 } );

callAccessToken = () => { // get public access token and cache it during one hour
    var data = qs.stringify({
        'grant_type': 'client_credentials' 
    });
    var config = {
        method: 'post',
        url: `${process.env.SPOTIFY_ACCOUNTS_SERVICE_HOST}/api/token`,
        headers: { 
          'Authorization': `Basic ${getBase64Credentials()}`, 
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
    };
    return axios(config)
    .then(function (response) {
        bearerCache = spotifyCache.set("access_token", response.data.access_token)
        console.log(response.data.access_token);
        return bearerCache;
    })
    .catch(function (error) {
        return error;
    });
}

getAccessToken = () => {
    if(spotifyCache.get("access_token") === undefined){ // if the access token is not cached anymore, we get another one
        if(!(await callAccessToken())){
            return undefined;
        }
    }
    return spotifyCache.get("access_token");
}

getBase64Credentials = () => btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);

exports.searchArtist = async (name, offset) => {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/search?query=${name}&type=artist&offset=${offset}&limit=5`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
        }
    };
    return axios(config)
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        return error;
    });
}

exports.getTopSongs = async (artist) => {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/artists/${artist}/top-tracks?market=FR`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
        }
    };
    return axios(config)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

exports.getAlbums = async (artist) => {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/artists/${artist}/albums`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
        }
    };
    return axios(config)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

exports.getAlbumTracklist = async (album) => {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/albums/${album}/tracks`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
        }
    };
    return axios(config)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

exports.getTrack = async (track) => {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/tracks/${track}`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
        }
    };
    return axios(config)
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}