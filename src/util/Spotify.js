const clientId = 'dcb4af187106414283bc95c3b17e6471';
const redirectURI = 'http://tearful-point.surge.sh';
let accessToken;

const Spotify = {
//Get the access token
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      if (window.location.href.match(/access_token=([^&]*)/) &&
          window.location.href.match(/expires_in=([^&]*)/))  {
            accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
            const expiresIn = Number(window.location.href.match(/expires_in=([^&]*)/)[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
          } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
          }
    }
  },
//Handle search of Spotify Libraries
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed - Could not get access token!');
    }, networkError => {
      console.log(networkError.message);
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            albumimg: track.album.images[2].url
          }
        ))
      } else {
        return []
      }}
    )
  },

// Request to save the playlist to the user's account
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return '';
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;
    return fetch('https://api.spotify.com/v1/me',
    {
      headers: headers
    }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request Failed - Could not get profile!');
      }, networkError => {
        console.log(networkError.message);
      }).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Request failed - playlist creation failed!');
          }, networkError => {
            console.log(networkError.message);
          }).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackURIs})
            }).then(response => {
              if (response.ok) {
                return response.json()
              }
              throw new Error('Request failed!');
              }, networkError => {
                console.log(networkError.message);
              })
          })
        })


}

}
export default Spotify;
