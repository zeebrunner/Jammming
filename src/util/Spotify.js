const clientId = 'dcb4af187106414283bc95c3b17e6471';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken(){
    if(accessToken){
      return accessToken;
    } else{
      // Check for access token
      if(window.location.href.match(/access_token=([^&]*)/) &&
         window.location.href.match(/expires_in=([^&]*)/)){
           accessToken = window.location.href.match(/access_token=([^&]*)[1];
           const expiresIn = Number(window.location.href.match(/expires_in=([^&]*)/));
           window.setTimeout(() => accessToken = '', expiresIn * 1000);
           window.history.pushState('Access Token', null, '/');
           return accessToken;
         } else {
           window.location = `https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=token&scope=playlist-modify-public&redirect_uri=REDIRECT_URI`
         }
    }
  }
  search(term){
    
  }
}

export default Spotify;
