import { playModes, mutationTypes } from '../assets/js/constants';
const _ = require('lodash');
// import  {Song, Album} from './song';
// import store from '.';

// const Promise = require('bluebird');

 function PlayList (songs, albums) {
    // it must be -1
    // bcoz in musicControls.vue -> playPauseAudio() is assuming that
    // if selected song in store is null, then player has not started itself.
    // So it is emitting a nextSong action,
    // But next song has to be the first one
    let selectedIndex = -1;
    let list = [];
    let shuffledList = [];
    /// list pointer which points any of above two lists
    let selectedList = null;
    let loopAll = true;
    let shuffled = false;
    // let unmodifiedSongs = Array.from(songs);
    // let unmodifiedAlbums = Array.from(albums);

    // region constructor
    // create a list
    songs = songs ? songs : [];
    songs.forEach((song, index) => {
        list.push({
            index,
            songID: song._id
        });
    });
    // set list pointer to list
    selectedList = list;

    // props initialization
    let playMode = playModes.LOOP_ALL;
    // attach functions to all songs
    // (async function() {
    //     await Promise.map(songs, async (song, index) => {
    //         songs[index] = new Song(song, index);
    //     }, {concurrency: 500});
    //     console.log(songs);
    //     store.commit({
    //         type: mutationTypes.SET_FORMATTED_SONGS,
    //         payload: songs
    //     });
    // })();

    // (async function() {
    //     await Promise.map(albums, async (album, index) => {
    //         albums[index] = new Album(album, index);
    //     }, {concurrency: 500});
    //     console.log(albums);
    //     store.commit({
    //         type: mutationTypes.SET_FORMATTED_ALBUMS,
    //         payload: albums
    //     });
    // })();
    // end region

    this.clone = function() {
        return new PlayList(Array.from(songs), Array.from(albums));
    }

    this.contains = function(song) {
        return _.find(songs, {_id: song._id});
    }

    this.setPlayMode = function(selectedPlayMode) {
        // set playMode prop
        playMode = selectedPlayMode;
        // based on playMode set sub-mode(s) (E.g. loop)
        switch(playMode) {
            case playModes.LOOP_ALL:
              this.loopAll();
              break;
            case playModes.ONCE_ALL:
              this.onceAll();
              break;
        }
    }

    // returns new shuffled list
    let getShuffledList =  function(list) {
        ///// --------------------------------------------------
        // Using Fisher–Yates Shuffle Algorithm
        ///// --------------------------------------------------
        let srcArray = Array.from(list),shuffledList = [], listSize = list.length, index;

        // While there remain elements to shuffle…
        while (listSize) {

            // Pick an element from remaining list
            index = Math.floor(Math.random() * srcArray.length);

            // If not already shuffled, move it to the new array.
            if (index in srcArray) {
                shuffledList.push(srcArray[index]);
                delete srcArray[index];
                listSize--;
            }
        }
        console.log(shuffledList);
        return shuffledList;
    }

    let shuffle = function() {
        shuffledList =  getShuffledList(list);
        // select shuffled list
        selectedList = shuffledList;
    }

    this.toggleShuffle =  function() {
        // shuffle lists every time when shuffle is enabled
        if(shuffled) {
            // select un-shuffled list
            selectedList = list;
        } else {
            // call shuffle method for selected playlist
            shuffle();
        }
        shuffled = !shuffled;
    }

    let getIndex = function(songID) {
        let getIndex = function(entry) {
            return entry.songID == songID;
        }
        return selectedList.findIndex(getIndex);
    }
    let playOrPause = function(songIndex, state) {
        // if SongIndex is null, stop player
        if(songIndex == null) return;
        // make new Selection
        state.selectedSong = songs[songIndex];
        // load Audio player with new selection source
        state.selectedSong.load();
        // play new Song
        state.selectedSong.playOrPause();
    }
    let nextIndex = function(autoplay) {
        // debugger;
        // console.log(autoplay);
        // after last song return null if loopAll set to false
        if(!loopAll && selectedIndex == selectedList.length - 1 && autoplay) return null;
        selectedIndex = (selectedIndex + 1) % selectedList.length;
        return selectedList[selectedIndex].index;
    }
    this.playNextSong = function(autoplay, state) {
        playOrPause(nextIndex(autoplay), state);
    }
    let previousIndex = function(autoplay) {
        // before first song return null if loopAll set to false
        if(!loopAll && selectedIndex == 0 && autoplay) return null;
        selectedIndex = (selectedIndex - 1 + selectedList.length) % selectedList.length;
        return selectedList[selectedIndex].index;
    }
    this.playPreviousSong = function(autoplay, state) {
        playOrPause(previousIndex(autoplay), state);
    }
    this.getCurrentSongIndex = function() {
        return selectedIndex;
    }
    // this.getNextSongIndex = function(autoplay) {
    //     // find nexSongIndex from selected playlist
    //     // based on playMode
    //     return nextIndex(autoplay);
    // }
    // returns previous song index based on playMode
    // this.getPreviousSongIndex = function(autoplay) {
    //     // find nexSongIndex from selected playlist
    //     // based on playMode
    //     return previousIndex(autoplay);
    // }
    this.selectNewSong =  function(song) {
        selectedIndex = getIndex(song._id);
    }
    // this.selectShuffledList = function() {
    //     selectedList = shuffledList;
    // }
    // this.selectUnshuffledList = function() {
    //     selectedList = list;
    // }
    this.loopAll = function() {
        loopAll = true;
    }
    this.onceAll = function() {
        loopAll = false;
    }
}

// const playlists = {
//     // props
//     // ---------------------------------------------------------------------------------
//     // this prop is not under usage. 
//     // Re-check and remove !!!!! important
//     // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     playMode: null,
//     // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     // playlist pointer
//     // changes based on play mode
//     selectedPlaylist: null,
//     // shuffle Flag
//     shuffle: null,
//     // ----------------------------------------------------------------------------------
//     // initialization without which app may crash
//     init: async function(songs) {
//         this.sequenceLoopPlaylist.init(songs);
//         // props initialization
//         this.playMode = playModes.LOOP_ALL;
//         this.selectedPlaylist = 'sequenceLoopPlaylist';
//         this.shuffle =  false;
//         // attach functions to all songs
//         await Promise.map(songs, async (song, index) => {
//             songs[index] = new Song(song, index);
//         }, {concurrency: 500});
//         console.log(songs);
//         store.commit({
//             type:mutationTypes.SET_FORMATTED_SONGS,
//             payload: songs
//         });
//     },
//     setPlayMode: function(playMode) {
//         // set playMode prop
//         this.playMode = playMode;
//         // based on playMode set sub-mode(s) (E.g. loop)
//         switch(playMode) {
//             case playModes.LOOP_ALL:
//               // select playlist
//               this.selectedPlaylist = 'sequenceLoopPlaylist';
//               // select sub-mode
//               this.sequenceLoopPlaylist.loopAll();
//               break;
//             case playModes.ONCE_ALL:
//               this.sequenceLoopPlaylist.onceAll();
//               break;
//         }
//     },
//     selectNewSong: function(song) {
//         this[this.selectedPlaylist].selectNewSong(song);
//     },
//     playThisNext: function(song) {
//         this[this.selectedPlaylist];
//     }, 
//     // returns next song index based on playMode
//     getNextSongIndex: function(autoplay) {
//         // find nexSongIndex from selected playlist
//         // based on playMode
//         return this[this.selectedPlaylist].nextIndex(autoplay);
//     },
//     // returns previous song index based on playMode
//     getPreviousSongIndex: function(autoplay) {
//         // find nexSongIndex from selected playlist
//         // based on playMode
//         return this[this.selectedPlaylist].previousIndex(autoplay);
//     },
//     toggleShuffle: function() {
//         this.shuffle = !this.shuffle;
//         // shuffle lists every time when shuffle is enabled
//         if(this.shuffle) {
//             // call shuffle method for selected playlist
//             this[this.selectedPlaylist].shuffle();
//             // select shuffled list
//             this[this.selectedPlaylist].selectShuffledList();
//         } else {
//             // select un-shuffled list
//             this[this.selectedPlaylist].selectUnshuffledList();
//         }
//     },
//     // returns new shuffled list
//     shuffleList: function(list) {
//         ///// --------------------------------------------------
//         // Using Fisher–Yates Shuffle Algorithm
//         ///// --------------------------------------------------
//         let srcArray = Array.from(list),shuffledList = [], listSize = list.length, index;

//         // While there remain elements to shuffle…
//         while (listSize) {

//             // Pick an element from remaining list
//             index = Math.floor(Math.random() * srcArray.length);

//             // If not already shuffled, move it to the new array.
//             if (index in srcArray) {
//                 shuffledList.push(srcArray[index]);
//                 delete srcArray[index];
//                 listSize--;
//             }
//         }
//         console.log(shuffledList);
//         return shuffledList;
//     },
//     // Play modes
//     sequenceLoopPlaylist: new function() {
//         // it must be -1
//         // bcoz in musicControls.vue -> playPauseAudio() is assuming that
//         // if selected song in store is null, then player has not started itself.
//         // So it is emitting a nextSong action,
//         // But next song has to be the first one
//         let selectedIndex = -1;
//         let list = [];
//         let shuffledList = [];
//         /// list pointer which points any of above two lists
//         let selectedList = null;
//         let loopAll = true;
//         this.init = function(songs) {
//             // create a list
//             songs.forEach((song, index) => {
//                 list.push({
//                     index,
//                     songID: song._id
//                 });
//             });
//             // set list pointer to list
//             selectedList = list;
//             // console.log(list);
//         }
//         let getIndex = function(songID) {
//             let getIndex = function(entry) {
//                 return entry.songID == songID;
//             }
//             return selectedList.findIndex(getIndex);
//         }
//         this.getCurrentSongIndex = function() {
//             return selectedIndex;
//         }
//         this.selectNewSong =  function(song) {
//             selectedIndex = getIndex(song._id);
//         }
//         this.shuffle = function() {
//             // 'this' pointer in this function is parent's
//             shuffledList =  playlists.shuffleList(list);
//         }
//         this.selectShuffledList = function() {
//             selectedList = shuffledList;
//         }
//         this.selectUnshuffledList = function() {
//             selectedList = list;
//         }
//         this.nextIndex = function(autoplay) {
//             // console.log(autoplay);
//             // after last song return null if loopAll set to false
//             if(!loopAll && selectedIndex == selectedList.length - 1 && autoplay) return null;
//             selectedIndex = (selectedIndex + 1) % selectedList.length;
//             return selectedList[selectedIndex].index;
//         }
//         this.previousIndex = function(autoplay) {
//             // before first song return null if loopAll set to false
//             if(!loopAll && selectedIndex == 0 && autoplay) return null;
//             selectedIndex = (selectedIndex - 1 + selectedList.length) % selectedList.length
//             return selectedList[selectedIndex].index;
//         },
//         this.loopAll = function() {
//             loopAll = true;
//         },
//         this.onceAll = function() {
//             loopAll = false;
//         }
//     },

// }

window.playlistClass = PlayList;

function Playlists() {
    let playlists = [];
    let selectedListIndex = -1;
    this.selectedPlaylist = null;
    this.exhaustiveList = null; // contains whole data
    this.add = function (newPlaylist) {
        playlists.push(newPlaylist);
    }

    this.delete = function (playlistID) {

    }
}

Playlists.prototype.createDynamicList = function(playlist) {
    return playlist.clone();
}

let playlists = new Playlists();
export { playlists, PlayList};