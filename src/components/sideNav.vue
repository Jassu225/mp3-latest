<template>
  <v-layout
    wrap
  >

    <v-navigation-drawer
      v-model="toggleDrawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img v-if="usrImg" src="../assets/images/accountIconDefault.png">
            <v-icon v-else>account_circle</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Doe</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list class="pt-0" dense>

        <v-list-tile
          @click="navigateToFileUpload"
        >
          <v-list-tile-action>
            <v-icon>{{ items.upload.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ items.upload.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>{{ items.profile.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ items.profile.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="navigateToUploadProgress">
          <v-list-tile-action>
            <v-icon>{{ items.filesUploading.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
              <v-container class="no-padding">
                {{ items.filesUploading.title }}
                <span class="uploadCount">{{uploadCount}}</span>
              </v-container>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-icon>{{ items.playlists.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ items.playlists.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>{{ items.settings.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ items.settings.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="(item, index) in extras" :key="index">
          <v-list-tile-title>{{item}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script>
import {sideNavContent} from '../assets/js/constants.js';

export default {
    props: [
      'sideNavbar',
      'navigateToFileUpload',
      'uploadCount',
      'navigateToUploadProgress'
    ],
    data () {
        return {
          items: sideNavContent,
          toggleDrawer: false,
          usrImg: null,
          extras: ['About', 'Support', 'Donate Us']
        }
    },
    watch: {
        // whenever question changes, this function will run
        sideNavbar: function (newVal, oldVal) {
            this.toggleDrawer = !this.toggleDrawer;
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.uploadCount {
  font-size: 1.2rem;
  float: right;
  padding: 0 1rem;
  background-color: #a4e3cc;
  border-radius: 50%;
}

.no-padding {
  padding: 16px 0;
}
</style>
