<template>
    <v-card color="transparent" dark class="full-height" style="{overflow: auto;}">
        <v-list v-if="uploadingFiles.length">
            <transition-group name="fade">
                <v-list-tile v-for="(file, index) in uploadingFiles" :key="index">
                    <v-list-tile-content>
                        <v-list-tile-title>{{file.name}}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-progress-circular
                            :rotate="360"
                            :size="40"
                            :width="4"
                            :value="(file.uploadedSize / file.totalSize * 100)"
                            class="blue-variant"
                        >
                            {{Math.floor(file.uploadedSize / file.totalSize * 100)}}
                        </v-progress-circular>
                    </v-list-tile-action>
                </v-list-tile>
            </transition-group>
        </v-list>
        <v-card-text v-else>
            <h1>No Uploads to Display</h1>
            <!-- <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>Song Name</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-progress-circular
                            :rotate="360"
                            :size="40"
                            :width="4"
                            :value="38"
                            
                        >
                            38
                        </v-progress-circular>
                    </v-list-tile-action>
                </v-list-tile> -->
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['uploadingFiles']
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.blue-variant {
    color: #24a5ee;
}
</style>
