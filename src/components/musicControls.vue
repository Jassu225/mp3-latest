<template>
    <div class="footer navColor grid">
        <div class="grid seekbarGrid">
            <div class="time">{{ getReadableTime(currentTime) }}</div>
            <div class="seekbarContainer grid">
                <div class="seekbar" ref="seekbar" @mousedown="getOffsetX">
                    <div class="seekedBar" :style="{width: seekbarWidthPercentage + '%'}" style="max-width:100%;">
                        <span ref="seekbarTip" class="seekbarTip"></span>
                    </div>
                </div>
            </div>
            <div class="time">{{ getReadableTime(duration) }}</div>
        </div>
        <div class="controlsContainer grid">
          <div class="selectedSong">
            <div class="imageContainer" :style="{'background-image': 'url(' + selectedSongAlbumImage + ')'}">
              <!-- <img :src="selectedSongAlbumImage"/> -->
            </div>
            <div class="selectedSongInfo" v-if="selectedSong">{{ selectedSong.title }} <div style="color: #9a9a9a;">{{ selectedSong.album }}</div></div>
          </div>
          <div class="controls">
            <v-icon @click="replay()">{{ AVIcons.replay }}</v-icon>
            <v-icon :class="{disabled: !shuffle}" @click="toggleShuffle">{{ AVIcons.shuffle }}</v-icon>
            <!-- <v-icon @click="replay(5)">{{ AVIcons.fastRewind }}</v-icon> -->
            <v-icon @click="previousSong">{{ AVIcons.skipPrevious }}</v-icon>
            <v-icon @click="playPauseAudio">{{ Icons[IconSelector] }}</v-icon>
            <v-icon @click="nextSong">{{ AVIcons.skipNext }}</v-icon>
            <!-- <v-icon @click="replay(-5)">{{ AVIcons.fastForward }}</v-icon> -->
            <v-icon @click="changePlayMode">{{ playModeIcons[playModeIconSelector] }}</v-icon>
            <div class="inline-block" 
              @mouseover="showVolumebar"
              @mouseout="hideVolumeBar">
              <v-icon
               class="volume-icon"
               @click="toggleMute"
              >
                {{ volumeIcons[volumeIconsSelector]}}
              </v-icon>
              <div class="volumeBar-container" :hidden="volumebarHidden">
                <div class="volumeBar" ref="volumebar" @mousedown="getOffsetYOfVolumebar">
                  <div class="volumeBar-seeker" :style="{height: volumebarHeight + '%'}" style="max-height: 100%">
                    <span class="volumeBarTip"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <v-alert
              value="true"
              transition="opacity 2s ease-in-out"
              class="control-alert"
              :class="{'full-opacity': alert}"
            >
              <v-icon dark>{{ alertIcons[alertIconSelector] }}</v-icon>
          </v-alert>
        </div>
    </div>
</template>

<script>
import { AVIcons, mutationTypes, KeyPress, images } from '../assets/js/constants';
import CommonFunctianalities from '../assets/js/commonFunctionalities.js';
const _ = require('lodash');
import defaultSongCover from '../assets/images/defaultSongCover.png';

export default {
  data() {
    return {
      alert: false,
      volumebarHidden: true,
      draggable: false,
      seekbarStartPosition: 0,
      seekbarWidth: 0,
      seekbarEndPosition: 0,
      percentageForAudio: 0,
      AVIcons,
      Icons: [AVIcons.playCircle, AVIcons.pauseCircle],
      IconSelector: 0,
      playModeIcons: [AVIcons.loopAll, AVIcons.onceAll, AVIcons.repeatOne],
      playModeIconSelector: 0,
      shuffle: false,
      alertIcons: [AVIcons.unmute, AVIcons.mute, AVIcons.pause, AVIcons.playArrow],
      alertIconSelector: 0,
      alertIconSelectorMute: 0,
      timeoutID: null,
      volumebarStartPosition: 0,
      volumebarEndPosition: 0,
      volumebarHeight: 100,
      isVolumebarDraggable: false,
      volumeIcons: [AVIcons.volumeOff, AVIcons.volumeDown, AVIcons.volumeUp]
    };
  },
  props: ['seekablebarWidth', 'updateAudioTime', 'currentTime' , 'duration', 'audioVolume'],
  mounted() {
    // Window Listeners req. for seekbar
    window.addEventListener("mouseup", this.addMouseUpListener);
    this.addMouseMoveListener();
    // Window listener(s) req. for music controls
    window.addEventListener("keypress", this.addKeypressListenerToWindow);
    // add reference to store
    this.$store.commit(mutationTypes.CREATE_MUSIC_CONTROLS_REFERENCE, {
      musicControlsReference: this
    });
  },
  computed: {
    seekbarWidthPercentage: function() {
      if(this.draggable)
        return this.seekbarWidth;
      else
        return this.seekablebarWidth;
    },
    volumeIconsSelector: function() {
      return Math.ceil(this.audioVolume * (this.volumeIcons.length - 1));
    },
    selectedSongAlbumImage: function() {
      let song = this.$store.state.selectedSong;
      if(song) {
        let album = _.find(this.$store.state.albums, {title: song.album});
        return album.cover == images.defaultAlbumCover ? defaultSongCover : album.cover;
      }
    },
    selectedSong: function() {
      return this.$store.state.selectedSong;
    }
    // currentTime: function() {
    //   return this.getReadableTime(this.$store.state.audioPlayer.currentTime);
    // },
    // durationTime: function() {
    //   return this.getReadableTime(this.$store.state.audioPlayer.duration);
    // }
  },
  methods: {
    showVolumebar() {
      this.volumebarHidden = false;
    },
    hideVolumeBar() {
      this.volumebarHidden = true;
    },
    toggleMute: function() {
      this.$store.commit(mutationTypes.MUTE_AUDIO);
      this.alertIconSelectorMute = (this.alertIconSelectorMute + 1) % 2;
      this.popAlert(this.alertIconSelectorMute);
    },
    getReadableTime: new CommonFunctianalities().getReadableTime,
    addKeypressListenerToWindow(event) {
      console.log(event);
      event.preventDefault();
      let keyCode = event.which || event.keyCode;
      console.log(keyCode);
      switch(keyCode) {
        //mute audio
        case KeyPress.M:
        case KeyPress.m: 
          this.$store.commit(mutationTypes.MUTE_AUDIO);
          this.alertIconSelectorMute = (this.alertIconSelectorMute + 1) % 2;
          this.popAlert(this.alertIconSelectorMute);
          break;
        case KeyPress.SPACE_BAR:
          console.log('matched');
          this.playPauseAudio();
      }
      
    },
    getOffsetX: function(event) {
      // console.log(event);
      // console.log(this.$el.offsetWidth);
      // console.log(event.offsetWidth);
      // console.log(this.$el.getClientRects());
      let boundinClientRect = this.$refs.seekbar.getBoundingClientRect();
      this.seekbarStartPosition = boundinClientRect.left;
      this.seekbarEndPosition = boundinClientRect.right;
      console.log(this.seekbarEndPosition - this.seekbarStartPosition);
      // this.seekPercentage = ( (event.x - this.seekbarStartPosition) / (this.seekbarEndPosition - this.seekbarStartPosition) );
      this.seekTo( (event.x - this.seekbarStartPosition) / (this.seekbarEndPosition - this.seekbarStartPosition) * 100);
      this.enableDrag();
      // console.log(this.seekPercentage);
      // this.seek = !this.seek;
      // console.log('et')
    },
    getOffsetYOfVolumebar: function(event) {
      let boundinClientRect = this.$refs.volumebar.getBoundingClientRect();
      this.volumebarStartPosition = boundinClientRect.bottom;
      this.volumebarEndPosition =boundinClientRect.top;
      console.log(this.volumebarEndPosition - this.volumebarStartPosition);
      let fraction = (event.y - this.volumebarStartPosition) / (this.volumebarEndPosition - this.volumebarStartPosition);
      
      this.seekVolumeTo(fraction * 100);
      this.enableDragToVolumebar();
      this.setVolume(fraction);
    },
    seekVolumeTo: function(percentage) {
      this.volumebarHeight = percentage;
    },
    enableDragToVolumebar: function() {
      this.isVolumebarDraggable = true;
    },
    disableDragToVolumebar: function() {
      this.isVolumebarDraggable = false;
    },
    addMouseUpListener: function() {
      // console.log("mouseup listener");
      if (this.draggable ) {
        console.log('drag off');
        // this.$store.state.audioPlayer.currentTime = this.width / 100 * this.$store.state.audioPlayer.duration;
        
        // update audio time
        this.updateAudioTime(this.percentageForAudio);
        // disable drag
        setTimeout(this.disableDrag, 40) ;
        // this.playingStarted? this.setTimer() : null;
      } else if(this.isVolumebarDraggable) {
        console.log('off volume drag');
        this.disableDragToVolumebar();
      }
      // this.removeMouseMoveListener();
    },
    disableDrag: function() {
      // this.removeListener  = !this.removeListener;
      this.draggable = false;
    },
    enableDrag: function() {
      this.draggable = true;
    },
    addMouseMoveListener: function() {
      window.addEventListener("mousemove", this.subsequentSeekbarUIUpdate);
    },
    subsequentSeekbarUIUpdate: function(event) {
      // console.log("mouse move");
      if( this.draggable) {
        // console.log('subsequent seekbar UI update');
        this.seekTo( (event.x - this.seekbarStartPosition) / (this.seekbarEndPosition - this.seekbarStartPosition) * 100);
      } else if(this.isVolumebarDraggable) {
        let fraction = (event.y - this.volumebarStartPosition) / (this.volumebarEndPosition - this.volumebarStartPosition);
        this.seekVolumeTo(fraction * 100);
        this.setVolume(fraction);
      }
    },
    setVolume: function(fraction) {
      let volume = fraction > 0 ?  (fraction < 1? fraction : 1): 0;
      this.$store.state.audioPlayer.volume = volume;
      // this.volumeIconsSelector = Math.ceil(volume * (this.volumeIcons.length - 1));
    },
    seekTo: function(percentage) {
      this.percentageForAudio = percentage;
      // console.log(value);
      this.seekbarWidth = percentage;
    },
    setPlayIcon: function() {
      this.IconSelector = 0;
      this.popAlert(2);
    },
    setPauseIcon: function() {
      this.IconSelector = 1;
      this.popAlert(3);
    },
    popAlert: function(value) {
      this.alertIconSelector = value;
      this.alert = true;
      // this.alert = false;
      window.clearTimeout(this.timeoutID);
      this.timeoutID =  setTimeout(() => this.alert = false, 2000);
    },
    playPauseAudio: function() {
      let audio = this.$store.state.audioPlayer;
      // console.log(audio);
      if(audio.paused) {
        // if no audio src,
        // it means player has not started yet.
        // so start it by selecting first song in a list
        if(!this.$store.state.selectedSong) {
          this.$store.commit(mutationTypes.SELECT_SONG_BASED_ON_PLAYMODE, {
            next: true,
            previous: false,
            autoplay: false
          });
        }
        if(audio.readyState == 3 || audio.readyState == 4)
          audio.play();
      } else {
        audio.pause();
      }
    },
    previousSong: function() {
      // select previous song based on playMode
      this.$store.commit(mutationTypes.SELECT_SONG_BASED_ON_PLAYMODE, {
        next: false,
        previous: true,
        autoplay: false
      });
    },
    nextSong: function() {
      // select next song based on playMode
      this.$store.commit(mutationTypes.SELECT_SONG_BASED_ON_PLAYMODE, {
        next: true,
        previous: false,
        autoplay: false
      });
    },
    replay: function(value) {
      // console.log(value);
      if(!value)
        this.$store.state.audioPlayer.currentTime = 0;
      else
        this.$store.state.audioPlayer.currentTime -= value;
    },
    changePlayMode: function() {
      this.playModeIconSelector = (this.playModeIconSelector + 1) % this.playModeIcons.length;
      this.$store.commit(mutationTypes.SET_PLAY_MODE, {
        playMode: this.playModeIcons[this.playModeIconSelector]
      });
    },
    toggleShuffle: function() {
      this.$store.commit(mutationTypes.TOGGLE_SHUFFLE);
      this.shuffle = ! this.shuffle;
    }
  }
};
</script>

<style scoped>
.control-alert {
  width: 6rem;
  height: 3rem;
  border-radius: 1.5rem;
  position: absolute;
  top: 2%;
  right: 15%;
  background-color: rgba(100, 100, 100, 0.4) !important;
  opacity: 0;
  top: calc(-100vh + 8rem);
}

.controlsContainer {
  grid-template-columns: 35% 60%;
  grid-template-rows: 1fr;
  min-width: 0;
  min-height: 0;
}

.controlsContainer > div {
  min-width: 0;
  min-height: 0;
}

.full-opacity {
  opacity: 1;
}
.footer {
  grid-template-rows: 2rem 1fr;
  position: relative;
  z-index: 100;
}

.seekbarGrid {
  grid-template-columns: 10% 1fr 10%;
}

.seekbar {
  height: 2px;
  border-radius: 2px;
  align-self: center;
  background-color: #4b4b4b;
  cursor: pointer;
}

.seekedBar {
  height: 100%;
  border-radius: 2px;
  background-color: #e14236;
  cursor: pointer;
}

.selectedSong {
  display: grid;
  grid-template-columns: 24% 1fr;
  align-items: center;
  justify-content: center;
}

.imageContainer {
  /* width: 24%; */
  height: 100%;
  background-size: contain;
  background-position: center;
}

.selectedSongInfo {
  flex: 1 1 auto;
  color: #dadada;
  font-size: 0.8rem;
  text-align: start;
  padding-left: 1rem;
  padding-top: 0.4rem;
  box-sizing: border-box;
  align-self: flex-start;
}

/* .imageContainer > img {
  max-width: 100%;
  max-height: 100%;
} */

.seekbarTip {
  float: right;
  position: relative;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: #dadcdd;
  border-radius: 50%;
  cursor: pointer;
  /* opacity: 0; */
  transition: 0.3s opacity ease;
}

/* .seekbarTip:hover {
  opacity: 1;
} */

.controls {
  justify-self: self-start;
}

.controls  .v-icon {
  cursor: pointer;
  font-size: 2.2rem;
  color: #dddddd;
  margin-right: 1rem;
  padding: 0.2rem;
  border-radius: 50%;
}

.disabled {
  color: #839198 !important;
}

.controls  .v-icon:hover {
  color: #adadad;
}

.time {
  color: white;
  align-self: center;
}

.inline-block {
  display: inline-block;
}

.volumeBar-container {
  position: absolute;
  width: 2.8rem;
  height: 11rem;
  background-color: #3f3f3f;
  margin-top: -13.7rem;
  border-radius: 0.5rem;
}

.volumeBar {
  width: 4px;
  height: 80%;
  margin: auto;
  border-radius: 2px;
  background-color: #839198;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
}

.volumeBar-seeker {
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: #37718c;
  border-radius: 2px;
}

.volumeBarTip {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  position: absolute;
  margin-left: -5px;
  cursor: pointer;
}

.volume-icon {
  margin: 0;
}
</style>
