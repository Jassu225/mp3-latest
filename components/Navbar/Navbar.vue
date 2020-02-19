<template>
  <div>
    <v-toolbar class="navColor" dark tabs>
      <v-toolbar-side-icon @click.stop="sideNavbar = !sideNavbar"></v-toolbar-side-icon>
      <v-toolbar-title>Mp3 Player</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <more-menu></more-menu>
      <v-tabs
        slot="extension"
        v-model="tab"
        color="transparent"
        align-with-title
      >
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab v-for="item in menuItems" :key="item" @click="Tabs = true;">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </div>
</template>

<script>

import moreMenu from './MoreMenu.vue';
import { stateProps, mutationTypes } from '../../assets/data/constants';
import config from '../../app-config/config';

export default {
  components: {
    moreMenu,
  },
  // props: [
  //   'config',
  // ],
  data() {
    return {
      menuItems: [
        'Songs', 'Album', 'Artists',
      ],
    };
  },
  computed: {
    sideNavbar:  {
      get() {
        return this.$store.state[stateProps.sideNavbar];
      },
      set(newValue) {
        this.$store.commit(mutationTypes.TOGGLE_SIDENAV,{
          newValue,
        });
      },
    },
    tab: {
      get() {
        return this.$store.state[stateProps.tab];
      },
      set(newValue) {
        this.$store.commit(mutationTypes.SWITCH_TABS, {
          newValue,
        });
      },
    },
    Tabs: {
      get() {
        return true;
      },
      set(newValue) {
        return this.$store.commit(mutationTypes.CHANGE_TABS_VISIBILITY, {
          newValue,
        });
      },
    },
  },
};
</script>

<style>
.Vuegreen {
    background-color: #2caf77 !important;
    border-color: #2caf77 !important;
}

.navColor {
  /* background-color: #21242e !important; */
  background-color: #1c1c1c !important;
}

.v-tabs__bar {
    background-color: transparent !important;
}

.v-toolbar__content {
  height: 48px !important;
}

.v-toolbar__extension {
  height: 48px !important;
}

.full-width {
  width: 100%;
}

.invisible {
  visibility: hidden;
}

.overflow {
  overflow: auto;
}
</style>