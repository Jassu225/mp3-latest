import { playModes, mutationTypes } from '../assets/js/constants';
import  Song from './song';
import store from '.';

const Promise = require('bluebird');

const playlists = {
    // props
    // ---------------------------------------------------------------------------------
    // this prop is not under usage. 
    // Re-check and remove !!!!! important
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    playMode: null,
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // playlist pointer
    // changes based on play mode
    selectedPlaylist: null,
    // shuffle Flag
    shuffle: null,
    // ----------------------------------------------------------------------------------
    // initialization without which app may crash
    init: async function(songs) {
        this.sequenceLoopPlaylist.init(songs);
        // props initialization
        this.playMode = playModes.LOOP_ALL;
        this.selectedPlaylist = 'sequenceLoopPlaylist';
        this.shuffle =  false;
        // attach functions to all songs
        await Promise.map(songs, async (song, index) => {
            songs[index] = new Song(song, index);
        }, {concurrency: 500});
        console.log(songs);
        store.commit({
            type:mutationTypes.SET_FORMATTED_SONGS,
            payload: songs
        });
    },
    setPlayMode: function(playMode) {
        // set playMode prop
        this.playMode = playMode;
        // based on playMode set sub-mode(s) (E.g. loop)
        switch(playMode) {
            case playModes.LOOP_ALL:
              // select playlist
              this.selectedPlaylist = 'sequenceLoopPlaylist';
              // select sub-mode
              this.sequenceLoopPlaylist.loopAll();
              break;
            case playModes.ONCE_ALL:
              this.sequenceLoopPlaylist.onceAll();
              break;
        }
    },
    selectNewSong: function(song) {
        this[this.selectedPlaylist].selectNewSong(song);
    },
    // returns next song index based on playMode
    getNextSongIndex: function(autoplay) {
        // find nexSongIndex from selected playlist
        // based on playMode
        return this[this.selectedPlaylist].nextIndex(autoplay);
    },
    // returns previous song index based on playMode
    getPreviousSongIndex: function(autoplay) {
        // find nexSongIndex from selected playlist
        // based on playMode
        return this[this.selectedPlaylist].previousIndex(autoplay);
    },
    toggleShuffle: function() {
        this.shuffle = !this.shuffle;
        // shuffle lists every time when shuffle is enabled
        if(this.shuffle) {
            // call shuffle method for selected playlist
            this[this.selectedPlaylist].shuffle();
            // select shuffled list
            this[this.selectedPlaylist].selectShuffledList();
        } else {
            // select un-shuffled list
            this[this.selectedPlaylist].selectUnshuffledList();
        }
    },
    // returns new shuffled list
    shuffleList: function(list) {
        ///// --------------------------------------------------
        // Using Fisher–Yates Shuffle Algorithm
        ///// --------------------------------------------------
        var srcArray = Array.from(list),shuffledList = [], listSize = list.length, index;

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
    },
    // Play modes
    sequenceLoopPlaylist: new function() {
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
        this.init = function(songs) {
            // create a list
            songs.forEach((song, index) => {
                list.push({
                    index,
                    songID: song._id
                });
            });
            // set list pointer to list
            selectedList = list;
            // console.log(list);
        }
        let getIndex = function(songID) {
            let getIndex = function(entry) {
                return entry.songID == songID;
            }
            return selectedList.findIndex(getIndex);
        }
        this.selectNewSong =  function(song) {
            selectedIndex = getIndex(song._id);
        }
        this.shuffle = function() {
            // 'this' pointer in this function is parent's
            shuffledList =  playlists.shuffleList(list);
        }
        this.selectShuffledList = function() {
            selectedList = shuffledList;
        }
        this.selectUnshuffledList = function() {
            selectedList = list;
        }
        this.nextIndex = function(autoplay) {
            // console.log(autoplay);
            // after last song return null if loopAll set to false
            if(!loopAll && selectedIndex == selectedList.length - 1 && autoplay) return null;
            selectedIndex = (selectedIndex + 1) % selectedList.length;
            return selectedList[selectedIndex].index;
        }
        this.previousIndex = function(autoplay) {
            // before first song return null if loopAll set to false
            if(!loopAll && selectedIndex == 0 && autoplay) return null;
            selectedIndex = (selectedIndex - 1 + selectedList.length) % selectedList.length
            return selectedList[selectedIndex].index;
        },
        this.loopAll = function() {
            loopAll = true;
        },
        this.onceAll = function() {
            loopAll = false;
        }
    },

}

export default playlists;