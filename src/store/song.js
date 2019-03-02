import store from '../store';
import {mutationTypes} from '../assets/js/constants';

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
    audioPlayer.src = src;
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

export default function Song(songFromDB, index) {
    for(let prop in songFromDB ) {
        if(songFromDB.hasOwnProperty(prop))
            this[prop] = songFromDB[prop];
    }
    this.isPlaying = false;
    this.index = index;
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

// Song.prototype.actions = function(action) {
//     switch(action) {
//         case addItems.PLAY_NEXT:
//             // console.log('play Next');
//             store.commit( mutationTypes.PLAY_NEXT, {
//                 songID: this.song._id
//             });
//             break;
//         case addItems.QUEUE:
//             break;
//         case addItems.NEW_PLAYLIST:
//             break;
//     }
// }

Song.prototype.sameSelection = function() {
    let song = this;
    let currentSelection = store.state.selectedSong;
    return currentSelection && song && currentSelection._id == song._id;
}

Song.prototype.select = function() {
    let song = this;
    // if not same selection,
    // 1 - make new selection,
    // 2 - pause audio player,
    // 3 - load the audio
    // console.log(this.sameSelection(song));
    if(!this.sameSelection()) {
        // console.log('select new song');
        store.commit(mutationTypes.SELECT_SONG, {
            song
        });
        // pause Audio
        pauseAudio();
        // load Audio with new source
        loadAudio(song.path);
    }
}

// Song.prototype.getReadableTime = function(duration) {
//     let seconds = duration, minutes = 0, hours = 0;
//     while(seconds > 60) {
//         minutes ++;
//         seconds -= 60;
//     }
//     while(minutes > 60) {
//         hours ++;
//         minutes -= 60;
//     }

//     seconds = Math.round(seconds);

//     return ( 
//     `${hours ? hours + ':' : ''}` +
//     `${minutes ? (hours ? (minutes >= 10 ? minutes : '0' + minutes) : minutes) : '0'}:` +
//     `${seconds ? (seconds > 9 ? seconds: '0' + seconds) : '00'}`
//     );
// }