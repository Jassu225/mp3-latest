<template>
  <v-app style="overflow: hidden;">
    <side-nav 
        :sideNavbar="sideNavbar"
        :navigateToFileUpload="navigateToFileUpload"
        :navigateToUploadProgress="navigateToUploadProgress"
        :uploadCount="uploadingFiles.length"
        :goToSettings="navigateToSettings"
    ></side-nav>
    <album-view
      :record="specificRecord"
    ></album-view>
    <div class="root-grid grid full-height">
      <navbar :config="config"></navbar>
      <div class="position-relative">
        <div class="overflow position-absolute full-width full-height">
          <tab-content :config="config" class="full-height"></tab-content>
        </div>
        <div v-if="!Tabs" class="position-absolute full-width full-height">
          <!-- <router-view 
            name="fileUpload" 
            :config="config"
            :uploadProgress="uploadProgress"
            :uploadComplete="uploadComplete"
            :uploadFailed="uploadFailed"
            :uploadCanceled="uploadCanceled"
            :addToUploadingFiles="addToUploadingFiles"
          ></router-view>
          <router-view
            name="uploadProgress"
            :uploadingFiles="uploadingFiles"
          ></router-view> -->
          <router-view
            name="settings"
          ></router-view>
        </div>
      </div>
      <audio 
        ref="audioPlayer" 
        class="hidden"
        @loadeddata="setDuration"
        @ended="audioEnded"
        @pause="audioPaused"
        @play="audioPlaying"
        @timeupdate="updateSeekbarWidthAndTime"
        @volumechange="audioVolumeChanged"
      ></audio>
      <music-controls 
        :seekablebarWidth="seekablebarWidth"
        :updateAudioTime="updateAudioTime"
        :currentTime="currentTime"
        :duration="duration"
        :audioVolume="audioVolume"
      ></music-controls>
    </div>
  </v-app>
</template>

<script>
import navbar from './components/navbar.vue';
import tabContent from './components/tabContent.vue';
import musicControls from './components/musicControls.vue';
import albumView from './components/albumView.vue';
import sideNav from './components/sideNav.vue';

import {actionTypes, mutationTypes, stateProps} from './assets/js/constants';
import config from './config';
import urls from './router/urls';

const INDEX_NOT_FOUND = -1;

export default {
  components: {
    navbar, musicControls, tabContent, sideNav, albumView
  },
  data () {
    return {
      config,
      seekablebarWidth: 0,
      currentTime: 0,
      duration: 0,
      uploadingFiles: [],
      audioVolume: 1
    }
  },
  computed: {
    sideNavbar: {
      get: function() {
          return this.$store.state[stateProps.sideNavbar];
      },
      set: function(newValue) {
          this.$store.commit(mutationTypes.TOGGLE_SIDENAV,{
              newValue
          });
      }
    },
    Tabs: {
        get: function() {
            return this.$store.state[stateProps.Tabs];
        },
        set: function(newValue) {
            return this.$store.commit(mutationTypes.CHANGE_TABS_VISIBILITY, {
                newValue
            });
        }
    },
    specificRecord: {
      get: function() {
        return this.$store.state.selectedRecord;
      }
    }
  },
  mounted: function() {
    this.$store.dispatch(actionTypes.GET_SONGS);
    //this.$store.dispatch(actionTypes.GET_ALBUMS);
    this.$store.commit(mutationTypes.CREATE_AUDIO_PLAYER_REFERENCE, {
      audioPlayerReference: this.$refs.audioPlayer
    });
  },
  methods: {
    navigateToFileUpload: function() {
        this.navigateTo(urls.FILE_UPLOAD);
    },
    navigateTo: function(route) {
        console.log(route);
        this.Tabs = false;
        this.$router.push(route);
        this.sideNavbar = false;
    },
    navigateToSettings: function () {
      this.navigateTo(urls.SETTINGS);
    },
    navigateToUploadProgress: function() {
        this.navigateTo(urls.UPLOAD_PROGRESS);
    },
    uploadProgress: function(fileName, completed) {
        //   console.log(event.loaded);
        //   console.log(event.total);
        this.uploadingFiles[this.getIndex(fileName)].uploadedSize = completed;
    },
    uploadComplete: function(fileName) {
        console.log('upload complete');
        this.uploadingFiles[this.getIndex(fileName)].uploadedSize = this.uploadingFiles[this.getIndex(fileName)].totalSize;
        this.removeFromUploadingFiles(fileName);
    },
    uploadFailed: function(fileName) {
        console.log('upload failed');
        this.removeFromUploadingFiles(fileName);
    },
    uploadCanceled: function(fileName) {
        console.log('upload canceled');
        this.removeFromUploadingFiles(fileName);
    },
    addToUploadingFiles: function(files) {
        console.log(files);
        files.forEach(file => {
            if(this.getIndex(file.name) == INDEX_NOT_FOUND) {
                this.uploadingFiles.push({
                    name: file.name,
                    totalSize: file.base64Size,
                    uploadedSize: 0,
                    index: this.uploadingFiles.length
                });
            } else {
                console.log(`${file.name} -- duplicate `);
            }
        });

        this.navigateToUploadProgress();
    },
    getIndex: function(fileName) {
        return this.uploadingFiles.findIndex(file => file.name === fileName);
    },
    removeFromUploadingFiles: function(fileName) {
        this.uploadingFiles.splice(this.getIndex(fileName), 1);
    },

    audioEnded() {
      // for setting play icon in song-block
      this.$store.state.selectedSong.ended();

      // set play icon in music-controls
      this.$store.state.musicControls.setPlayIcon();

      // select next song based on playMode
      this.$store.commit(mutationTypes.SELECT_SONG_BASED_ON_PLAYMODE, {
        next: true,
        previous: false,
        autoplay: true
      });
    },
    audioPaused() {
      if(!this.$refs.audioPlayer.ended) {
        // for setting play icon in song-block 
        this.$store.state.selectedSong.paused();

        // set play icon in music-controls
        this.$store.state.musicControls.setPlayIcon();
      }
    },
    audioPlaying() {
      // console.log(this.$store.state.selectedSong.islaying);
      this.$store.state.selectedSong.playing();

      // set play icon in music-controls
      this.$store.state.musicControls.setPauseIcon();
    },
    audioVolumeChanged() {
      this.audioVolume = this.$store.state.audioPlayer.volume;
    },
    updateSeekbarWidthAndTime() {
      let audio = this.$store.state.audioPlayer;
      this.seekablebarWidth = audio.currentTime / audio.duration * 100;
      // update current time
      this.currentTime = audio.currentTime;
    },
    updateAudioTime(percentage) {
      // console.log(percentage);
      let audio = this.$store.state.audioPlayer;
      if(audio.readyState < 3) return;
      audio.currentTime = percentage / 100 * audio.duration;
    },
    setDuration() {
      this.duration = this.$store.state.audioPlayer.duration;
    }
  }
}
</script>

<style>
html, body {
  overflow: auto !important;
  height: 100%;
  width: 100%;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  border: 4px solid #111;
  background-color: rgba(0,0,0,0.4);
  background-clip: content-box;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  border: 3px solid #111;
  background-color: #666;
  background-clip: content-box;
}

#app {
  /* font-family: 'Open Sans','Avenir', Helvetica, Arial, sans-serif; */
  font-family: 'Montserrat','Open Sans','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* background-color: #5f5f56; */
  width: 100%;
  height: 100%;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.application {
  line-height: 1;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hidden{
  display: none;
}

.grid {
  display: grid;
}

.root-grid {
  /* grid-template-rows:  96px calc(100% - 6rem - 96px) 6rem; */
  grid-template-rows:  96px 1fr 6rem;
}

.full-height {
  height: 100%;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.songs-container .contentContainer {
  /* scroll-behavior: smooth; */
  scroll-snap-type: y mandatory;
}
</style>