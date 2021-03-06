<template>
    <div class="albumView" :class="{animate: showAlbumView}" @transitionend="showData">
        <div class="view-grid">
            <div class="closeBtn" @click="showAlbumView = false">
                <material-icon>clear</material-icon>
            </div>
            <div class="recordInfo">
                <div class="image" 
                    :style="{'background-image': 'url(' + (record ? (record.cover == images.defaultAlbumCover ? defaultAlbumCover : (record.cover == images.defaultArtistCover ? defaultArtistCover : record.cover)) :'') + ')'}"
                    :class="{show: show}"
                ></div>
                <div style="min-width:0;min-height:0;">
                    <div class="data" :class="{show: show}">
                        <div class="ellipsis">title: <span class="album-title" :title="record ? record.title : ''">{{ record ? record.title : "" }}</span></div>
                        <div v-if="isAlbum()">year: <span class="album-year">{{ record ? record.year : "" }}</span></div>
                        <div>duration: {{ record ? getReadableTime(record.duration,"text") : "" }}</div>
                        <div v-if="isAlbum()">artists: {{ record && record.artists ? record.artists.join(", ") : "" }}</div>
                    </div>
                </div>
            </div>
            <div v-if="songs.length" class="songs-container fullWidth fullHeight PEN"
            :class="{show: show}" @transitionend="enablePointerEvents">
                <song-block 
                    v-for="(song, index) in songs"
                    :song="song"
                    :isPaused="isPaused"
                    :removeSelectedSong="removeSelectedSong"
                    :playAudio="playAudio"
                    :key="index"
                ></song-block>
            </div>
        </div>
    </div>
</template>

<script>
import materialIcon from './generic/materialIcon.vue';
import songBlock from './songBlock.vue';

import defaultArtistCover from '../assets/images/artistDefaultCover.png';
import defaultAlbumCover from '../assets/images/albumDefaultCover.png';
import { mutationTypes, images } from '../assets/js/constants.js';
import CommonFunctianalities from '../assets/js/commonFunctionalities.js';
const _ = require("lodash");

export default {
    props: ['record'],
    components: { materialIcon, songBlock },
    data: function() {
        return {
            show: false,
            defaultArtistCover,
            defaultAlbumCover,
            images
        };
    },
    computed: {
        showAlbumView: {
            get: function() {
                return this.$store.state.showAlbumView;
            },
            set: function(newVal) {
                this.$store.commit({
                    type: mutationTypes.SHOW_ALBUM_VIEW,
                    payload: {
                        showAlbumView: newVal
                    }
                });
            }
        },
        songs: {
            get: function() {
                let indices = this.record ? _.map(this.record.songsList, "index") : [];
                if(indices.length)
                    return _.filter(this.$store.state.songs, function(song) {
                        return indices.includes(song.index);
                    });
                return [];
            }
        },
        audioPlayer: function() {
            return this.$store.state.audioPlayer;
        }
    },
    methods: {
        showData: function(event) {
            if(event.target == event.currentTarget)
                this.show = !this.show;
        },
        enablePointerEvents: function() {
            event.target.classList.remove("PEN");
        },
        isAlbum: function() {
            return this.record && this.record.constructor.name == "Album";
        },
        getReadableTime: new CommonFunctianalities().getReadableTime,
        isPaused() {
            return this.audioPlayer.paused;
        },
        removeSelectedSong() {
            this.$store.commit(mutationTypes.REMOVE_SELECTED_SONG);
        },
        
        playAudio() {
            this.audioPlayer.play();
        }
    }
}
</script>

<style scoped>
.albumView {
    background-color: #3a3a3a;
    position: absolute;
    top: calc(100% - 6rem);
    transition: top 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    will-change: top; /* notifies the browser that this prop will be animated so that browser may increase the performance */
    width: 100%;
    height: calc(100% - 6rem);
    z-index: 10;
}

.animate {
    top: 0;
}

.view-grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 17.5rem 1fr;
    grid-template-areas: "recordInfo"
                         "songsContainer";
    overflow: hidden;
}

.closeBtn {
    position: absolute;
    right: 0;
    color: white;
}

.recordInfo {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: 16rem 1fr;
    box-sizing: border-box;
    padding: 0.75rem;
    grid-area: recordInfo;
    /* height: 16.75rem; */
}

.image {
    /* width: 20rem; */
    height: 16rem;
    /* background-color: #696868; */
    background-position: center;
    background-size: contain;
    opacity: 0;
    transition: 0.8s opacity 0.1s ease-out;
    will-change: opacity;
}

.data {
    width: 85%;
    transition: 0.36s width 0.1s ease-out, 0.36s opacity 0.15s ease-in;
    will-change: width, opacity;
    float: right;
    text-align: start;
    padding-left: 0.8rem;
    box-sizing: border-box;
    opacity: 0;
    color: #cecece;
    overflow: auto;
}

.data > div {
    padding: 0.4rem 0;
}

.data.show {
    width: 100%;
}

.album-title {
    color: whitesmoke;
    font-weight: 700;
    font-size: 1.2rem;
}

.songs-container {
    grid-area: songsContainer;
    background-color: #2f2f2f;
    margin-top: 2rem;
    opacity: 0;
    transition: 0.36s margin-top 0.1s ease-out, 0.36s opacity 0.15s ease-in-out;
    will-change: margin-top, opacity;
    overflow: auto;
    /* scroll-behavior: smooth; */
    scroll-snap-type: y mandatory;
}


.PEN {
    pointer-events: none;
}

.songs-container.show {
    margin-top: 0;
}

.show {
    opacity: 1;
}

</style>
