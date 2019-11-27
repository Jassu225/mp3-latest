<template>
    <div class="album">
        <div class="albumCoverContainer">
            <img :alt="artist.title" :src="artist.cover == images.defaultArtistCover ? defaultArtistCover : artist.cover" class="albumCover"/>
            <div class="hoverContent" @click="showAlbumView">
                <div class="infoHolder grid">
                    <div @click="artist.play()"><material-icon class="action-icon playIcon">play_arrow</material-icon></div>
                    <material-icon class="action-icon addIcon">add</material-icon>
                    <div class="additionalContent">
                        <span style="color: #b7babb;font-weight: 900;">Time - </span>
                        <span>{{ getReadableTime(artist.duration,"text") }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="artistTitle" :title="artist.title">{{ artist.title }}</div>
        <!-- <div class="artists" :title="album.artists">{{ album.artists.join(", ") }}</div> -->
    </div>
</template>

<script>

import materialIcon from './generic/materialIcon.vue';
import CommonFunctianalities from '../assets/js/commonFunctionalities.js';
import { images } from '../assets/js/constants.js';
import defaultArtistCover from '../assets/images/artistDefaultCover.png';
import { mutationTypes } from '../assets/js/constants.js';

export default {
    props: ['artistIndex', 'artist'],
    components: { materialIcon },
    data: function() {
        return {
            images,
            defaultArtistCover
        };
    },
    methods: {
        getReadableTime: new CommonFunctianalities().getReadableTime,
        showAlbumView: function (event) {
            if(event.target == event.currentTarget) {
                this.$store.commit({
                    type: mutationTypes.SHOW_ALBUM_VIEW,
                    payload: {
                        showAlbumView: true,
                        record: this.artist
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
.album {
    height: 230px;
    min-width: 0;
}

.albumCoverContainer {
    width: 100%;
    height: 75%;
    display: flex;
    align-items: center;
    justify-items: center;
    position: relative;
    background-color: #696868;
    border-radius: 6px;
    overflow: hidden;
}

.playIcon {
    grid-area: playIcon;
    right: -40px;
    transition: right 0.26s ease-in-out, transform 0.1s ease-in-out;
    will-change: right, transform;
}

.playIcon:hover, .addIcon:hover {
    transform: scale(1.2);
}

.addIcon {
    grid-area: addIcon;
    left: -40px;
    transition: left 0.26s ease-in-out, transform 0.1s ease-in-out;
    will-change: left, transform;
}

.additionalContent {
    grid-area: additionalContent;
    margin-top: 5px;
    text-align: start;
    width: 78%;
    margin-left: 4%;
}

.hoverContent {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.2s ease-in-out;
    will-change: opacity;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

.infoHolder {
    width: 90%;
    height: auto;
    grid-template-areas: "playIcon addIcon"
                         "additionalContent additionalContent";
    align-items: center;
    justify-items: center;
}

.hoverContent:hover {
    opacity: 1;
}

.albumCover {
    max-width: 100%;
    max-height: 100%;
}

.artistTitle, .artists {
    text-align: start;
}

.artistTitle {
    height: 25%;
    padding: 0.5rem;
    font-size: 13px;
}

.artists {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    font-size: 11px;
    color: #dcdcdc;
}

.action-icon {
    border-radius: 50%;
    background-color: red;
    width: 40px;
    height: 40px;
    line-height: 40px;
    position: relative;
}

.hoverContent:hover .playIcon {
    right: 0;
}

.hoverContent:hover .addIcon {
    left: 0;
}

</style>
