<template>
  <div class="song-block" :class="{selected: selected}">
    <div class="song-title" :title="song.title">{{ song.title }}</div>
    <div class="song-action" @click="song.playOrPause()">
      <material-icon title="play">{{ Icons[IconSelector] }}</material-icon>
    </div>
    <div class="song-action">
      <v-menu transition="slide-y-transition" bottom>
        <material-icon slot="activator" title="Add to queue">{{ AVIcons.add }}</material-icon>
        <v-list>
          <v-list-tile
            v-for="(item, index) in moreActions"
            :key="index"
            class="more-actions-item"
            @click="actions(item)"
          >
            <v-list-tile-title>{{ item }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <div class="song-artists" :title="song.artists.toString()">{{song.artists.toString()}}</div>
    <div class="song-album" :title="song.album">{{song.album}}</div>
    <div class="song-genre" :title="song.genre.toString()">{{song.genre.toString()}}</div>
    <div class="song-duration">{{getReadableTime(song.duration)}}</div>
  </div>
</template>

<script>
// component import(s)
import MaterialIcon from '../../Generic/MaterialIcon.vue';
import { AVIcons, mutationTypes } from '../../../assets/data/constants';
import config from '../../../app-config/config';

const addItems = {
  PLAY_NEXT: "Play Next",
  QUEUE: "Queue",
  NEW_PLAYLIST: "New Playlist",
};

export default {
  components: {
    MaterialIcon,
  },
  props: ["song", "pauseAudio", "removeSelectedSong", "playAudio", "isPaused"],
  data() {
    return {
      AVIcons,
      // config,
      Icons: [AVIcons.playArrow, AVIcons.pause],
      playIconIndex: 0,
      pauseIconIndex: 1,
      playPauseSelector: 0,
      isPlaying: false,
      moreActions: [addItems.PLAY_NEXT, addItems.QUEUE, addItems.NEW_PLAYLIST],
    };
  },
  computed: {
    selected() {
      let selectedSong = this.$store.state.selectedSong;
      // return selectedSong && selectedSong._id == this.song._id;
      return selectedSong && selectedSong.index == this.song.index;
    },
    IconSelector() {
      if (this.selected && this.song.isPlaying) return this.pauseIconIndex;
      else return this.playIconIndex;
    },
  },
  methods: {
    getReadableTime(duration) {
      let seconds = duration,
        minutes = 0,
        hours = 0;
      while (seconds > 60) {
        minutes++;
        seconds -= 60;
      }
      while (minutes > 60) {
        hours++;
        minutes -= 60;
      }

      seconds = Math.round(seconds);

      return (
        `${hours ? hours + ":" : ""}` +
        `${
          minutes
            ? hours
              ? minutes >= 10
                ? minutes
                : "0" + minutes
              : minutes
            : "0"
        }:` +
        `${seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00"}`
      );
    },
    actions(action) {
      switch (action) {
        case addItems.PLAY_NEXT:
          // console.log('play Next');
          this.$store.commit(mutationTypes.PLAY_NEXT, {
            song: this.song,
          });
          break;
        case addItems.QUEUE:
          this.$store.commit(mutationTypes.ADD_TO_QUEUE, {
            song: this.song,
          });
          break;
        case addItems.NEW_PLAYLIST:
          break;
      }
    },
  },
  // mounted: function() {
  //     // bind songIndex
  //     this.song.index = this.songIndex;
  //     // bind VueReference
  //     this.song.VueReference = this;
  //     // bind song Src (URL)
  //     // this.song.src = `${this.config.apiRootURL + this.config.uploadsDir}/${this.song.title}`;
  //     this.song.src = this.song.path;
  //     // console.log(this.song.src);
  // }
  // mounted: function() {
  //     console.log(this.song);
  // }
};
</script>

<style scoped>
.song-block {
  height: 3rem;
  display: grid;
  padding-left: 1rem;
  grid-gap: 1rem;
  grid-template-columns: 2fr 2rem 2rem 1fr 1fr 1fr 4rem;
  box-sizing: border-box;
  color: #ddd;
  border-bottom: 0.1px solid #504d4d;
  /* margin: 0 1rem; */
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.song-block:hover {
  background-color: #696868;
}

.song-block :last-child {
  border-bottom: 0;
}

.song-block > div {
  display: inline-block;
  align-self: center;
  text-align: center;
}

.song-block > .song-title {
  text-align: start;
}

.song-title,
.song-artists,
.song-album,
.song-genre {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.song-action {
  cursor: pointer;
}

.more-actions-item:hover {
  background-color: #dfdfdf;
}

.full-height {
  height: 3rem;
}

.song-block.selected {
  /* background-color: #414141; */
  background-color: #232630;
}

.song-block.selected > .song-title {
  color: #e72c30;
  font-weight: 600;
}
</style>
