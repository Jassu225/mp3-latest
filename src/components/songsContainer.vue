<template>
    <div class="full-height">
        <!-- Using Masonry (For grid-view) -->
        <!-- <div v-if="songs && songs.length" v-masonry transition-duration="0.3s" item-selector=".item">
            <div v-masonry-tile class="item" v-for="(song, index) in songs" :key="index">
                <song-block :song="song"></song-block>
            </div>
        </div> -->
        <!-- <audio ref="audioPlayer" class="hidden"></audio> -->
        <div v-if="songs && songs.length" class="songs-container overflow">
            <song-block 
                v-for="(song, index) in songs" 
                :key="index" 
                :songIndex="index"
                :song="song"
                :pauseAudio="pauseAudio"
                :isPaused="isPaused"
                :removeSelectedSong="removeSelectedSong"
                :selectSong="selectSong"
                :playAudio="playAudio"
                :playOrPause="playOrPause"
                :loadAudio="loadAudio"
            ></song-block>
        </div>
        <div v-else class="full-width">
            <h1>No Songs</h1>
        </div>
    </div>
</template>

<script>
import songBlock from './songBlock.vue';
import {mutationTypes} from '../assets/js/constants';

export default {
    data: function() {
        return {
            
        };
    },
    components: {
        songBlock
    },
    computed: {
        songs: function() {
            return this.$store.state.songs;
        },
        audioPlayer: function() {
            return this.$store.state.audioPlayer;
        }
    },
    methods: {
        pauseAudio() {
            if(!this.audioPlayer.paused)
                this.audioPlayer.pause();
            // console.log('pause audio');
        },
        isPaused() {
            return this.audioPlayer.paused;
        },
        removeSelectedSong() {
            this.$store.commit(mutationTypes.REMOVE_SELECTED_SONG);
            // console.log('remove selected song');
        },
        selectSong(song) {
            
            // if not same selection,
            // 1 - make new selection,
            // 2 - pause audio player,
            // 3 - load the audio
            // console.log(this.sameSelection(song));
            if(!this.sameSelection(song)) {
                // console.log('select new song');
                this.$store.commit(mutationTypes.SELECT_SONG, {
                    song
                });
                // pause Audio
                this.pauseAudio();
                // load Audio with new source
                this.loadAudio(song.src);
            }
        },
        playAudio() {
            this.audioPlayer.play();
        },
        loadAudio(src) {
            // console.log(src);
            this.audioPlayer.src = src;
            this.audioPlayer.load();
        },
        playOrPause() {
            if(this.isPaused()) {
                this.playAudio();
            }
            else {
                this.pauseAudio();
            }
        },
        sameSelection(song) {
            // let previousSelection = this.$store.state.previousSelection;
            let currentSelection = this.$store.state.selectedSong;
            return currentSelection && song && currentSelection._id == song._id;
        }
    }
}
</script>

<style scoped>
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

.songs-container {
    background-color: #111;
}
/* .songs-container > :nth-child(even) {
    background-color: #5d5c5c;
}

.songs-container > :nth-child(odd) {
    background-color: #4d4d4d;
} */

.full-width {
    width: 100%;
}

.overflow {
    overflow: auto;
}
</style>
