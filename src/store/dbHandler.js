const getPath = require('electron').remote.app.getPath;
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Datastore = require('nedb');
const dataPath = path.join(getPath('userData'),"DataStore");
const mm = require('music-metadata');
import {images} from '../assets/js/constants.js';
let defaultSongCover = images.defaultSongCover, 
defaultAlbumCover = images.defaultAlbumCover,
defaultArtistCover = images.defaultArtistCover;
const _ = require('lodash');


try {
    // create DataStore dir
    console.log("creating directory");
    fs.mkdirAsync(dataPath);
} catch(ex) {
    console.log(ex);
    console.log("Directory already exists");
}

const audioExtensions = [
    '.aac', '.aif', '.aifc', '.aiff', '.au',
    // '.lsf', // audio/video
    // '.lsx', // audio/video
    '.m4a', '.mid', '.midi', '.mp2', '.mp3', '.mpa', '.mpv2',
    '.ogg',
    '.ra', '.ram', '.rmi', '.rpm',
    '.snd',
    '.wma', '.wav'
];

const Objects = {
    song: function() {
      return {
        album: 'unknown',
        albumartist: ['unknown'],
        artists: ['unknown'],
        cover: defaultSongCover,
        disk: {
            no: -1,
            of: -1
        },
        duration: -1,
        extension: '',
        genre: ['unknown'],
        index: -1,
        path: 'unknown',
        playCount: 0,
        title: 'unknown',
        track: {
            no: -1,
            of: -1
        },
        year: 'unknown'
      }
    },
    album: function() {
      return {
        artists: ['unknown'],
        cover: defaultAlbumCover,
        duration: 0,
        index: -1,
        songsList: [],
        title: 'unknown',
        tracks: 0,
        year: 'unknown',
        playCount: 0
      }
    },
    artist: function() {
        return {
        //   artists: ['unknown'],
          cover: defaultArtistCover,
          duration: 0,
          index: -1,
          songsList: [],
          title: 'unknown',
          tracks: 0,
        //   year: 'unknown',
          playCount: 0
        }
      }
  };

function DataStore(dbNameWithExt) {
    const db = Promise.promisifyAll(new Datastore({ 
        filename: path.join(dataPath, dbNameWithExt),
        autoload: true
    }));

    this.getAllRecords = async function() {
        return await db.findAsync({});
    }
    
    let prototypeOf = function (value) {
        return Object.prototype.toString.call(value).split(" ")[1];
    }

    this.insert = async function(records) {
        if((prototypeOf(records) == "Array" && records.length) || records) {
            try {
                let newRecords = await db.insertAsync(records);
                return newRecords;
            } catch (err) { console.log(err); return false; }
        }
    }
}

function Fetch() {
    let formatWithArtistSchema = function (songs) {
        let artists = [];
        songs.forEach((song,index) => {
            let songArtists = [];
            song.artists.forEach((artist) => {
                if(artist.includes(',')) {
                    let artists = artist.split(',');
                    songArtists = _.uniqBy(songArtists.concat(artists), el => el.toLowerCase());
                } else
                    songArtists.push(artist);
            });
            song.artists = songArtists;
            let someArtists = _.filter(artists,artist => song.artists.includes(artist.title));
            if(someArtists.length) {
                for(let i = 0; i < someArtists.length; i++) {
                    let artist = someArtists[i];
                    artist.songsList.push({
                        path: song.path,
                        index
                    });
                    if (song.duration) artist.duration +=  song.duration;
                    artist.tracks++;
                }
            } else {
                for(let i = 0; i < song.artists.length; i++) {
                    let artist = Objects.artist();
                    artist.title = song.artists[i];
                    // album.cover = album.cover == defaultAlbumCover && song.cover != defaultSongCover ? song.cover : album.cover;
                    artist.duration = song.duration;
                    artist.songsList.push({
                        path: song.path,
                        index
                    });
                    artist.tracks++;
                    artist.index = artists.length;
                    artists.push(artist);
                }
            }
        });
        return artists;
    }

    let formatWithAlbumSchema = function (songs) {
        let albums = [];
        songs.forEach((song,index) => {
            let album = albums.find(album => album.title == song.album);
            // console.log(album);
            if(album) {
                album.songsList.push({
                    path: song.path,
                    index
                });
                // atrists concatenation not working
                if (song.artists) album.artists = album.artists.concat(song.artists);
                if (song.duration) album.duration +=  song.duration;
                album.tracks++;
                // await DBHandler.updateAlbum(album);
            } else {
                album = Objects.album();
                album.artists =  song.artists;
                album.cover = album.cover == defaultAlbumCover && song.cover != defaultSongCover ? song.cover : album.cover;
                album.duration = song.duration;
                album.songsList.push({
                    path: song.path,
                    index
                });
                album.title = song.album;
                album.tracks++;
                album.year = song.year;
                album.index = albums.length;
                // await DBHandler.addAlbum(album);
                albums.push(album);
            }
        });
        return albums;
    }

    let formatWithSongSchema = function(list) {
        let songs = [];
        // console.log(list);
        list.forEach((file, index) => {
            let song = Objects.song();
            let metaData = file.metadata;
            song.title = file.name;
            song.path = file.path;
            song.index = index;
            // console.log(file);
            if(metaData) {
                song.album = metaData.common.album ? metaData.common.album : song.album;
                song.albumartist = metaData.common.albumartist ? metaData.common.albumartist.split(',') : song.albumartist;
                song.artists = metaData.common.artists ? metaData.common.artists: song.artists;

                let picture = metaData.common.picture;
                song.cover = ( (picture && picture[0].data) ? `data:${picture[0].format};base64,${picture[0].data.toString('base64')}`: song.cover);
                song.disk.no = metaData.common.disk ? metaData.common.disk.no : song.disk.no;
                song.disk.of = metaData.common.disk ? metaData.common.disk.of : song.disk.of;
                song.duration = metaData.format.duration ? metaData.format.duration : song.duration;
                song.extension = file.ext;
                song.genre = metaData.common.genre ? metaData.common.genre : song.genre;
                song.track.no = metaData.common.track ? metaData.common.track.no : song.track.no;
                song.track.of = metaData.common.track ? metaData.common.track.of : song.track.of;
                song.year = metaData.common.year ? metaData.common.year : song.year;
            }

            songs.push(song);
        });
        return songs;
    }

    let getFoldersFromList = async function(list) {
        let allResults = await Promise.map(list, async file => {
            let stats = await fs.statAsync(file.path);
            return {
                ...file,
                stats
            };
        }, { concurrency: 100 });
        let folders = allResults.filter( file => file.stats.isDirectory(), []);
        return folders;
    }
    
    let extractMetadata = async function(songsList) {
        let songsListWithMetadata = await Promise.map(songsList, async song => {
            let metadata = null;
            try {
                metadata =  await mm.parseFile( song.path, {native: true});
            } catch (err) { console.error(err); }
            return {
                ...song,
                metadata 
            };
        }, { concurrency: 25 });
        return songsListWithMetadata;
    }

    let getSongsListFrom = async function(directories) {

        let allResults = await Promise.map(directories, async directory => {
            let newList =  await fs.readdirAsync(directory);
            for(let i = 0; i < newList.length; i++) {
                let ext = path.extname(newList[i]);
                newList[i] = {
                    name: path.basename(newList[i], ext),
                    path: (path.join(directory, newList[i])).replace(/\\/g,"/"),
                    ext
                };
            }
            return newList;
        }, { concurrency: 24 });

        let list = allResults.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
        let folders = await getFoldersFromList(list);
        if(folders.length)
            list = list.concat(await getSongsListFrom(folders.reduce((accumulator, folder) => accumulator.concat(folder.path), [])));
        return list.filter(file => audioExtensions.includes(file.ext));
    }

    this.getSongsFrom = async function(directories) {
        let songsList = await getSongsListFrom(directories);
        
        let songsListWithMetadata = await extractMetadata(songsList);
        // console.log(songsListWithMetadata);
        let songs = formatWithSongSchema(songsListWithMetadata);
        let albums = formatWithAlbumSchema(songs);
        let artists = formatWithArtistSchema(songs);
        // console.log(songs);
        // formatSongsAndAlbums(songs, albums);
        return [songs, albums, artists];
    }
}

export {
    DataStore,
    Fetch
}