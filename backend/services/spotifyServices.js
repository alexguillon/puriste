const axios = require('axios');
const qs = require('qs');
const btoa = require('btoa');

async function getAccessToken() {
    var data = qs.stringify({
        'grant_type': 'client_credentials' 
    });
    var config = {
        method: 'post',
        url: `${process.env.SPOTIFY_ACCOUNTS_SERVICE_HOST}/api/token`,
        headers: { 
          'Authorization': `Basic ${getAuthorizationToken()}`, 
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
    };
    return axios(config)
    .then(function (response) {
        console.log(response.data.access_token);
        return response.data.access_token;
    })
    .catch(function (error) {
        return error;
    });
}

function getAuthorizationToken(){
    return btoa(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET);
}

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

