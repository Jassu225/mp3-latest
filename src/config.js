// const apiKey = 'ad6d1b7996912f36983366d6dcabb471';
// const country = 'india';

// const dotenv = require('dotenv');
// const result = dotenv.config();

// console.log(result.parsed)

let apiRootURL = 'http://localhost:7991';
if(process.env.NODE_ENV == "production") {
    apiRootURL = 'https://music-rest-api.herokuapp.com';
}

console.log(apiRootURL);

const config = {
    apiRootURL,
    uploadSongURL: `${apiRootURL}/uploadSong`,
    uploadCompleteURL: `${apiRootURL}/uploadComplete`,
    getSongsURL: `${apiRootURL}/getSongs`,
    getAlbumsURL: `${apiRootURL}/getAlbums`,
    chunkSize: 262144, // 256 KB
    uploadsDir: '/uploads'
};

export default config;