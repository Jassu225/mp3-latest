<template>
  <div class="full-height">
    <div v-if="songs && songs.length" class="songs-container fullWidth fullHeight">
      <data-table :headers="songHeaders" :items="songs" :rowsPerPageNumber="5" rowText="song">
        <song
          slot="content"
          slot-scope="songItem"
          :song="songItem.item"
          :isPaused="isPaused"
          :removeSelectedSong="removeSelectedSong"
          :playAudio="playAudio"
        />
      </data-table>
    </div>
    <div
      v-else-if="true"
      class="full-width full-height flexContainer directionCol centerItemsVertically centerItemsHorizontally"
    >
      <h2>Loading</h2>
      <div class="currentLoadingSong truncateText centerText">Song</div>
    </div>
    <div v-else class="full-width full-height no-songs-container">
      <h1>No Songs found</h1>
      <div class="link">Show us where to look</div>
    </div>
  </div>
</template>

<script>
import Song from './Song.vue';
import DataTable from '../../Generic/DataTable.vue';
import { mutationTypes } from '../../../assets/data/constants';

export default {
  components: {
    Song,
    DataTable,
  },
  data() {
    return {
      songHeaders: [
        { title: "Title", sortable: true, width: "calc((99.9% - 8rem)*0.4)" },
        { title: "", sortable: false, width: "2rem" },
        { title: "", sortable: false, width: "2rem" },
        { title: "Artists", sortable: true, width: "calc((99.9% - 8rem)*0.2)" },
        { title: "Album", sortable: true, width: "calc((99.9% - 8rem)*0.2)" },
        { title: "Genre", sortable: true, width: "calc((99.9% - 8rem)*0.2)" },
        { title: "Time", sortable: false, width: "4rem" },
      ],
    };
  },
  computed: {
    songs() {
      return this.$store.state.songs;
    },
    audioPlayer() {
      return this.$store.state.audioPlayer;
    },
  },
  methods: {
    isPaused() {
      return this.audioPlayer.paused;
    },
    removeSelectedSong() {
      this.$store.commit(mutationTypes.REMOVE_SELECTED_SONG);
      // console.log('remove selected song');
    },

    playAudio() {
      this.audioPlayer.play();
    },
  },
};
</script>

<style scoped>
.footer {
  height: 7rem;
}

.hidden {
  display: none;
}
.item {
  min-width: 10rem;
  max-width: 23%;
  max-height: 50rem;
  background-color: darkgrey;
  margin: 1rem;
}

.link {
  font-weight: 400;
  font-size: 16px;
  color: #5196a7;
  text-decoration: underline;
  cursor: pointer;
}

.link:hover {
  color: #159eb5;
}

.songs-container {
  background-color: #111;
}
/* .songs-container > :nth-child(even) {
    background-color: #5d5c5c;
}

.songs-container > :nth-child(odd) {
    background-color: #4d4d4d;
} */

.no-songs-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

.overflow {
  overflow: auto;
}

.currentLoadingSong {
  width: 80%;
}
</style>
