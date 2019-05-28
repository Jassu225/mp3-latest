import store from '../store';
import {mutationTypes} from '../assets/js/constants';
const _ = require('lodash');

function getAudioPlayer() {
    return store.state.audioPlayer;
}

function pauseAudio() {
    let audioPlayer = getAudioPlayer();
    if(!audioPlayer.paused)
        audioPlayer.pause();
}

function loadAudio(src) {
    let audioPlayer = getAudioPlayer();
    audioPlayer.src = "file://" + src;
    audioPlayer.load();
}

function playOrPauseAudio() {
    let audioPlayer = getAudioPlayer();
    if(audioPlayer.paused) {
        audioPlayer.play();
    }
    else {
        audioPlayer.pause();
    }
}

//#region song
function Song(songFromDB, index) {
    for(let prop in songFromDB ) {
        if(songFromDB.hasOwnProperty(prop))
            this[prop] = songFromDB[prop];
    }
    this.isPlaying = false;
    // this.index = index;
}

Song.prototype.playOrPause = function() {
    // STORE IN STORE
    this.select();
    // play or pause
    playOrPauseAudio();
}

// These fuctions were called
// from App.Vue when the respective
// event is fired.
Song.prototype.ended = function() {
    this.isPlaying = false;
}

Song.prototype.paused = Song.prototype.ended;

Song.prototype.playing = function() {
    this.isPlaying = true;
}
// this function may be called from store
// after selecting next song based on playMode
Song.prototype.load = function() {
    loadAudio(this.path);
}

Song.prototype.sameSelection = function() {
    let song = this;
    let currentSelection = store.state.selectedSong;
    // return currentSelection && song && currentSelection._id == song._id;
    return currentSelection && song && currentSelection.index == song.index;
}

Song.prototype.existsInCurrentPlaylist = function() {
    let song = this;
    let playlist = store.state.playlists.selectedPlaylist;
    return playlist && song && playlist.contains(song);
}

Song.prototype.select = function() {
    // let song = this;
    // if not same selection,
    // 1 - make new selection,
    // 2 - pause audio player,
    // 3 - load the audio
    // console.log(this.sameSelection(song));
    if(!this.sameSelection()) {
        // console.log('select new song');
        if(!this.existsInCurrentPlaylist()) {
            store.commit({
                type: mutationTypes.SET_PLAYLIST,
                payload: store.state.playlists.exhaustiveList
            });
        }

        store.commit(mutationTypes.SELECT_SONG, {
            song: this
        });
        // pause Audio
        pauseAudio();
        // load Audio with new source
        // loadAudio(song.path);
        this.load();
    }
}
//#endregion

//#region album
function Album(albumFromDB,index) {
    for(let prop in albumFromDB ) {
        if(albumFromDB.hasOwnProperty(prop))
            this[prop] = albumFromDB[prop];
    }
    this.isPlaying = false;
    // this.index = index;
}

Album.prototype.alreadySelected = function() {
    return this && store.state.selectedAlbum && this._id == store.state.selectedAlbum._id;
}

Album.prototype.select = function() {
    // debugger;
    if(!this.alreadySelected()) {
        store.commit(mutationTypes.SELECT_ALBUM, {
            album: this
        });
    }
    // pause Audio
    pauseAudio();
    // debugger;
    // load Audio with new source
    let song = _.find(store.state.songs, { index: this.songsList[0].index });
    if(song) {
        song.load();
        song.playOrPause();
    } else {
        console.error("song not found");
    }
}

Album.prototype.play = function() {
    // console.log('playing album');
    this.select();
    // playOrPauseAudio();
}
//#endregion

//#region artist
function Artist(artistFromDB,index) {
    for(let prop in artistFromDB ) {
        if(artistFromDB.hasOwnProperty(prop))
            this[prop] = artistFromDB[prop];
    }
    this.isPlaying = false;
    // this.index = index;
}

Artist.prototype.alreadySelected = function() {
    return this && store.state.selectedArtist && this._id == store.state.selectedArtist._id;
}

Artist.prototype.select = function() {
    // debugger;
    if(!this.alreadySelected()) {
        store.commit(mutationTypes.SELECT_ARTIST, {
            artist: this
        });
    }
    // pause Audio
    pauseAudio();
    // debugger;
    // load Audio with new source
    let song = _.find(store.state.songs, { index: this.songsList[0].index });
    if(song) {
        song.load();
        song.playOrPause();
    } else {
        console.error("song not found");
    }
}

Artist.prototype.play = function() {
    this.select();
    // playOrPauseAudio();
}
//#endregion

export {
    Song, Album, Artist
}