const getPath = require('electron').remote.app.getPath;
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Datastore = require('nedb');
const dataPath = path.join(getPath('userData'),"DataStore");
var mm = require('music-metadata');

try {
    // create DataStore dir
    fs.mkdirAsync(dataPath);
} catch(ex) {
    console.error(ex);
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
        cover: '/dist/defaultCover.png',
        disk: {
            no: -1,
            of: -1
        },
        duration: -1,
        extension: '',
        genre: ['unknown'],
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
        cover: '/dist/defaultCover.png',
        duration: 0,
        songsList: [],
        title: 'unknown',
        tracks: 0,
        year: 'unknown'
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
    let formatWithAlbumSchema = async function (songs) {
        let album = await DBHandler.findAlbum(metaData.common.album ? metaData.common.album : 'unknown');
        // console.log(album);
        if(album) {
            album.songsList.push(fileName);
            // atrists concatenation not working
            metaData.common.artists ? album.artists.concat(metaData.common.artists): null;
            metaData.format.duration ? album.duration +=  metaData.format.duration : currentSong.duration;
            album.tracks++;
            await DBHandler.updateAlbum(album);
        } else {
            album = Objects.album();
            album.artists =  metaData.common.artists ? metaData.common.artists: album.artists;
            let picture = metaData.common.picture;
            album.cover =  ( (picture && picture[0].data) ? `data:${picture[0].format};base64,${picture[0].data.toString('base64')}`: album.cover);
            album.duration =  metaData.format.duration ? metaData.format.duration : album.duration;
            album.songsList.push(fileName);
            album.title = metaData.common.album ? metaData.common.album : album.title;
            album.tracks++;
            album.year = metaData.common.year ? metaData.common.year : album.year;
            await DBHandler.addAlbum(album);
        }
    }

    let formatWithSongSchema = function(list) {
        let songs = [];
        list.forEach(file => {
            let song = Objects.song();
            let metaData = file.metadata;
            song.title = file.name;
            song.path = file.path;
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
        // console.log(songs);
        return songs;
    }
}

export {
    DataStore,
    Fetch
}