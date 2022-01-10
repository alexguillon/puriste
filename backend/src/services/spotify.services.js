import axios from 'axios';
import qs from 'qs';
import btoa from 'btoa';
import NodeCache from 'node-cache';
const spotifyCache = new NodeCache( { stdTTL: 3480, checkperiod: 3600 } );

const callAccessToken = async () => { // get public access token and cache it during one hour
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

const getAccessToken = async () => {
    if(spotifyCache.get("access_token") === undefined){ // if the access token is not cached anymore, we get a new token
        if(!(await callAccessToken())){
            return undefined;
        }
    }
    return spotifyCache.get("access_token");
}

const getBase64Credentials = () => btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);

export async function searchArtist(name, offset) {
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

export async function getTopSongs(artist) {
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

export async function getAlbums(artist) {
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

export async function getAlbumTracklist(album) {
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

export async function getTrack(track){
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

export async function searchTracks(name, offset, limit) {
    let accessToken = await getAccessToken();
    var config = {
        method: 'get',
        url: `${process.env.SPOTIFY_API_SERVICE_HOST}/v1/search?query=${name}&type=track&offset=${offset}&limit=${limit}`,
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