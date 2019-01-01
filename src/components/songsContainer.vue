<template>
    <div class="full-height">
        <!-- Using Masonry (For grid-view) -->
        <!-- <div v-if="songs && songs.length" v-masonry transition-duration="0.3s" item-selector=".item">
            <div v-masonry-tile class="item" v-for="(song, index) in songs" :key="index">
                <song-block :song="song"></song-block>
            </div>
        </div> -->
        <!-- <audio ref="audioPlayer" class="hidden"></audio> -->
        <!-- <div class="header">
            <div class="textOverflowEllipsis">Title</div>
            <div class="textOverflowEllipsis"></div>
            <div class="textOverflowEllipsis"></div>
            <div class="textOverflowEllipsis">Artists</div>
            <div class="textOverflowEllipsis">Album</div>
            <div class="textOverflowEllipsis">Genre</div>
            <div class="textOverflowEllipsis">Time</div>
        </div> -->
        <div v-if="songs && songs.length" class="songs-container fullWidth fullHeight">
            <!-- <song-block 
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
            ></song-block> -->
            <data-table
                :headers="songHeaders"
                :items="songs"
                rowsPerPageNumber=5
                rowText="song"
            >
                <song-block 
                    slot="content"
                    slot-scope="songItem" 
                    :songIndex="songItem.index"
                    :song="songItem.item"
                    :pauseAudio="pauseAudio"
                    :isPaused="isPaused"
                    :removeSelectedSong="removeSelectedSong"
                    :selectSong="selectSong"
                    :playAudio="playAudio"
                    :playOrPause="playOrPause"
                    :loadAudio="loadAudio"
                ></song-block>
            </data-table>
        </div>
        <div v-else-if="true" class="full-width full-height flexContainer directionCol centerItemsVertically centerItemsHorizontally">
            <h2>Loading</h2>
            <div class="currentLoadingSong truncateText centerText">Song</div>
        </div>
        <div v-else class="full-width full-height no-songs-container">
            <h1>No Songs found</h1>
            <div class="link">Show us where to look</div>
        </div>
        <!-- <div class="footer"></div> -->
    </div>
</template>

<script>
import songBlock from './songBlock.vue';
import dataTable from './generic/dataTable.vue';
import {mutationTypes} from '../assets/js/constants';

export default {
    data: function() {
        return {
            songHeaders: [
                {title: "Title", sortable: true, width: 'calc((99.9% - 8rem)*0.4)'},
                {title: "", sortable: false, width: '2rem'},
                {title: "", sortable: false, width: '2rem'},
                {title: "Artists", sortable: true, width: 'calc((99.9% - 8rem)*0.2)'},
                {title: "Album", sortable: true, width: 'calc((99.9% - 8rem)*0.2)'},
                {title: "Genre", sortable: true, width: 'calc((99.9% - 8rem)*0.2)'},
                {title: "Time", sortable: false, width: '4rem'}
            ]
        };
    },
    components: {
        songBlock, dataTable
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
