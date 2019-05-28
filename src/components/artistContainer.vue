<template>
    <div class="full-height">
        <div v-if="artists && artists.length" class="artists-container grid">
            <artist-block 
                v-for="(artist, index) in artists" 
                :key="index" 
                :artistIndex="index"
                :artist="artist"
            ></artist-block>
        </div>
        <div v-else class="full-width full-height flexContainer \
            centerItemsVertically centerItemsHorizontally">
            <h1>No Artists Found</h1>
        </div>
    </div>
</template>

<script>
import artistBlock from './artistBlock.vue';

export default {
    components: {
        artistBlock
    },
    computed: {
        artists: function() {
            return this.$store.state.artists;
        }
    }
}
</script>

<style>
.artists-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 10px;
    grid-gap: 15px;
    overflow: visible;
}
</style>
