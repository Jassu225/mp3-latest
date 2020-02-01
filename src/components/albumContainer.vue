<template>
    <div class="full-height">
        <div v-if="albums && albums.length" class="albums-container grid full-height">
            <album-block 
                v-for="(album, index) in albums" 
                :key="index" 
                :albumIndex="index"
                :album="album"
            ></album-block>
        </div>
        <div v-else class="full-width full-height flexContainer \
            centerItemsVertically centerItemsHorizontally">
            <h1>No Albums</h1>
        </div>
    </div>
</template>

<script>
import albumBlock from './albumBlock.vue';

export default {
    components: {
        albumBlock
    },
    computed: {
        albums: function() {
            return this.$store.state.albums;
        }
    }
}
</script>

<style>
.albums-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 10px;
    grid-gap: 15px;
    overflow: visible;
    background-color: #111;
}

@media screen and (min-width: 1200px){
    .albums-container {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
</style>
