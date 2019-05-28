import Vue from 'vue';
import Vuex from 'vuex';
import {mutationTypes, actionTypes, playModes, dirs} from '../assets/js/constants';
import {DataStore, Fetch} from './dbHandler';
// play sequences based on playModes
import {playlists, PlayList} from './playlists';
const Promise = require('bluebird');
const _ = require('lodash');
import {Song, Album, Artist} from './song';

const songsDB = new DataStore("songs.db");
const albumsDB = new DataStore("albums.db");
const artistsDB = new DataStore("artists.db");
const fetch = new Fetch();

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
      // To show and hide side-navbar
      sideNavbar: false,
      // To switch between tabs
      tab: null,
      //  To check if tabs are shown on screen
      Tabs: true,
      // ---------------
      songs: [],
      albums: [],
      artists: [],
      audioPlayer: null,
      previousSelection: null,
      selectedSong: null,
      selectedAlbum: null,
      selectedArtist: null,
      playlists,
      // Below prop has been removed and added to playlists
      // seemed unnecessary to declare here
      // playMode: playModes.LOOP_ALL,
      seekablebarWidth: 0,
      musicControls: null,
      audioVolumes: [0, 1],
      // must not change
      audioVolumesSelector: 1
    },
    mutations: {
      // to toggle side-navbar
      [mutationTypes.TOGGLE_SIDENAV] (state,payload) {
        state.sideNavbar = payload.newValue;
      },
      // to switch between tabs
      [mutationTypes.SWITCH_TABS] (state, payload) {
        state.tab = payload.newValue;
      },
      // to change visibility of tabs
      [mutationTypes.CHANGE_TABS_VISIBILITY] (state, payload) {
        state.Tabs = payload.newValue;
      },
      [mutationTypes.CREATE_AUDIO_PLAYER_REFERENCE] (state, payload) {
        state.audioPlayer = payload.audioPlayerReference;
        // console.log(payload.audioPlayerReference);
      },
      [mutationTypes.CREATE_MUSIC_CONTROLS_REFERENCE] (state, payload) {
        state.musicControls = payload.musicControlsReference;
      },
      [mutationTypes.SELECT_SONG] (state, payload) {
        // make current selection as previous selection
        state.previousSelection = state.selectedSong;
        // make new selection as current selection
        state.selectedSong = payload.song;
        // update playlist's selected song index 
        // in the selected playlist based on playMode
        playlists.selectedPlaylist.selectNewSong(payload.song);
      },
      [mutationTypes.SELECT_ALBUM] (state, payload) {
        state.selectedAlbum = payload.album;
        // get songs from album
        let targetSongs = _.intersectionBy(state.songs,payload.album.songsList, 'index');
        // payload.album.songsList.forEach(obj => {
        //   targetSongs.push(state.songs[obj.index]);
        // });
        console.log(targetSongs);
        playlists.selectedPlaylist = new PlayList(targetSongs, [payload.album]);
      },
      [mutationTypes.SELECT_ARTIST] (state, payload) {
        state.selectedArtist = payload.artist;
        // get songs from album
        let targetSongs = _.intersectionBy(state.songs,payload.artist.songsList, 'index');
        // payload.album.songsList.forEach(obj => {
        //   targetSongs.push(state.songs[obj.index]);
        // });
        console.log(targetSongs);
        playlists.selectedPlaylist = new PlayList(targetSongs, []);
      },
      //  Music Controls' actions
      // -------------------------------------------------------------------
      [mutationTypes.SELECT_SONG_BASED_ON_PLAYMODE] (state, payload) {
        // make current selection previous
        state.previousSelection = state.selectedSong;

        // let SongIndex = null;

        // get next song index from playlists
        if(payload.next)   playlists.selectedPlaylist.playNextSong(payload.autoplay, state);
        else if(payload.previous)  playlists.selectedPlaylist.playPreviousSong(payload.autoplay, state);

        // if SongIndex is null, stop player
        // if(SongIndex == null) return;
        // // make new Selection
        // state.selectedSong = state.songs[SongIndex];
        // // load Audio player with new selection source
        // state.selectedSong.load();
        // // play new Song
        // state.selectedSong.playOrPause();
      },
      [mutationTypes.TOGGLE_SHUFFLE] (state) {
        playlists.selectedPlaylist.toggleShuffle();
      },
      // ----------------------------------------------------------------------------------
      [mutationTypes.SET_PLAY_MODE] (state, payload) {
        if(payload.playMode == playModes.REPEAT_ONE) state.audioPlayer.loop = true;
        else {
          state.audioPlayer.loop = false;
          playlists.selectedPlaylist.setPlayMode(payload.playMode);
        }
      },
      // Song Actions
      // ---------------------------------------------------------------
      [mutationTypes.PLAY_NEXT] (state, payload) {
        
      },
      // -----------------------------------------------------------------
      // key controls
      [mutationTypes.MUTE_AUDIO] (state) {
        // store current volume
        state.audioVolumes[state.audioVolumesSelector] = state.audioPlayer.volume;
        // increment selector
        state.audioVolumesSelector = (state.audioVolumesSelector + 1) % state.audioVolumes.length;
        // mute / unmute
        state.audioPlayer.volume = state.audioVolumes[state.audioVolumesSelector];
      },
      [mutationTypes.SET_FORMATTED_SONGS] (state, {payload}) {
        console.log(payload);
        state.songs = payload;
      },
      [mutationTypes.SET_FORMATTED_ALBUMS] (state, {payload}) {
        console.log(payload);
        state.albums = payload;
      },
      [mutationTypes.SET_FORMATTED_ARTISTS] (state, {payload}) {
        console.log(payload);
        state.artists = payload;
      },
      [mutationTypes.SET_PLAYLIST] (state, {payload}) {
        let newPlaylist = payload;
        state.playlists.selectedPlaylist = state.playlists.createDynamicList(newPlaylist);
      }
    },
    actions: {
      // async [actionTypes.GET_SONGS_FROM_SERVER] ({state}) {
      //   let data = await APIHandler.getSongs();
      //   state.songs = JSON.parse(data).songs;
      //   console.log(state.songs);
      //   playlists.init(state.songs);
      //   // console.log(data.songs[0].album);
      // },
      async [actionTypes.GET_SONGS_FROM_DB] () {
        return await songsDB.getAllRecords();
      },
      async [actionTypes.GET_ALBUMS_FROM_DB]() {
        return await albumsDB.getAllRecords();
      },
      async [actionTypes.GET_ARTISTS_FROM_DB]() {
        return await artistsDB.getAllRecords();
      },
      async [actionTypes.GET_SONGS_FROM_SYSTEM] () {
        return await fetch.getSongsFrom([dirs.downloadsDir, dirs.musicDir]);
      },
      async [actionTypes.FORMAT_SONGS] ({commit}, songs) {
        await Promise.map(songs, async (song, index) => {
          songs[index] = new Song(song);
        }, {concurrency: 500});
        console.log(songs);
        commit({
            type: mutationTypes.SET_FORMATTED_SONGS,
            payload: songs
        });
      },
      async [actionTypes.FORMAT_ALBUMS] ({commit}, albums) {
        await Promise.map(albums, async (album, index) => {
          albums[index] = new Album(album);
        }, {concurrency: 500});
        console.log(albums);
        commit({
            type: mutationTypes.SET_FORMATTED_ALBUMS,
            payload: albums
        });
      },
      async [actionTypes.FORMAT_ARTISTS] ({commit}, artists) {
        await Promise.map(artists, async (artist, index) => {
          artists[index] = new Artist(artist);
        }, {concurrency: 500});
        console.log(artists);
        commit({
            type: mutationTypes.SET_FORMATTED_ARTISTS,
            payload: artists
        });
      },
      async [actionTypes.GET_SONGS] ({ dispatch, commit, state }) {
        // await dispatch(actionTypes.GET_SONGS_FROM_SERVER)
        // debugger;
        let songs = [], albums = [], artists = [];
        [songs, albums, artists] = await Promise.map([actionTypes.GET_SONGS_FROM_DB, 
          actionTypes.GET_ALBUMS_FROM_DB, actionTypes.GET_ARTISTS_FROM_DB], function(action) {
          return dispatch(action);
        });
        if(!songs.length) {
          // find songs in system
          [songs, albums, artists] = await dispatch(actionTypes.GET_SONGS_FROM_SYSTEM);
          // add to songs DB
          [songs, albums, artists] = await Promise.map([{db: songsDB, payload: songs},
            {db: albumsDB, payload: albums}, {db: artistsDB, payload: artists}], function(target){
            return target.db.insert(target.payload);
          });
        }
        console.log(songs);
        // await dispatch(actionTypes.FORMAT_SONGS, songs);
        // await dispatch(actionTypes.FORMAT_ALBUMS, albums);
        await Promise.map([{action: actionTypes.FORMAT_SONGS, payload: songs},
          {action: actionTypes.FORMAT_ALBUMS, payload: albums},
          {action: actionTypes.FORMAT_ARTISTS, payload: artists}], function(target) {
          return dispatch(target.action, target.payload);
        });
        playlists.exhaustiveList = new PlayList(state.songs, state.albums);
        commit({
          type: mutationTypes.SET_PLAYLIST,
          payload: playlists.exhaustiveList
        });
      },
      async [actionTypes.GET_ALBUMS_FROM_SERVER]({state}) {
        let data = await APIHandler.getAlbums();
        
        state.albums = JSON.parse(data).albums;
        console.log(state.albums);
        // playlists.init(state.songs);
        // console.log(data.songs[0].album);
      },
      
      async [actionTypes.GET_ALBUMS] ({dispatch}) {
        // await dispatch(actionTypes.GET_ALBUMS_FROM_SERVER);
        let albums = await dispatch(actionTypes.GET_ALBUMS_FROM_DB);
      }
    }
})

export default store;