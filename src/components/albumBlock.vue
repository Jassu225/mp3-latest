<template>
    <div class="album">
        <div class="albumCoverContainer" :style="{'background-image': 'url(' + (album.cover == images.defaultAlbumCover ? defaultAlbumCover : album.cover) +')'}">
            <!-- <img :alt="album.title" :src="album.cover" class="albumCover"/> -->
            <div class="hoverContent" @click="showAlbumView">
                <div class="infoHolder grid">
                    <div @click="album.play()"><material-icon class="action-icon playIcon">play_arrow</material-icon></div>
                    <material-icon class="action-icon addIcon">add</material-icon>
                    <div class="additionalContent">
                        <span style="color: #b7babb;font-weight: 900;">Time - </span>
                        <span>{{ getReadableTime(album.duration,"text") }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="albumTitle ellipsis" :title="album.title">{{ album.title }}</div>
        <div class="artists ellipsis" :title="album.artists">{{ album.artists.join(", ") }}</div>
    </div>
</template>

<script>

import materialIcon from './generic/materialIcon.vue';
import CommonFunctianalities from '../assets/js/commonFunctionalities.js';
import { mutationTypes, images } from '../assets/js/constants.js';
import defaultAlbumCover from '../assets/images/albumDefaultCover.png';

let commonFunctionalities = new CommonFunctianalities();

export default {
    props: ['albumIndex', 'album'],
    components: { materialIcon },
    data: function() {
        return {
            images,
            defaultAlbumCover
        };
    },
    methods: {
        getReadableTime: commonFunctionalities.getReadableTime,
        showAlbumView: function (event) {
            if(event.target == event.currentTarget) {
                // console.log('album View show');
                this.$store.commit({
                    type: mutationTypes.SHOW_ALBUM_VIEW,
                    payload: {
                        showAlbumView: true,
                        record: this.album
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
.album {
    height: 210px;
    min-width: 0;
}

.albumCoverContainer {
    width: 100%;
    height: 84%;
    /* display: flex; */
    /* align-items: center; */
    /* justify-items: center; */
    /* position: relative; */
    /* background-color: #696868; */
    background-position: center;
    background-size: contain;
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
    text-align: center;
    width: 100%;
}

.hoverContent {
    /* position: absolute; */
    opacity: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.2s ease-in-out;
    will-change: opacity;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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

.albumTitle, .artists {
    text-align: start;
}

.albumTitle {
    height: 8%;
    font-size: 13px;
}

.artists {
    width: 100%;
    height: 8%;
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
