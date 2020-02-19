<template>
    <div class="tabs">
      <v-tabs-items v-model="tab"
        class="full-width full-height"
        :class="{noOpactiy: !Tabs}"
      >
        <v-tab-item
          v-for="(tabComponent, index) in tabComponents"
          :key="index"
          class="full-height overflow"
        >
          <v-card flat color="transparent" dark class="full-height">
            <component :is="tabComponent" />
          </v-card>
        </v-tab-item>
        <!-- <v-tab-item class="full-height overflow">
          <v-card flat color="transparent" dark class="full-height">
            <album-container></album-container>
          </v-card>
        </v-tab-item>
        <v-tab-item class="full-height overflow">
          <v-card flat color="transparent" dark class="full-height">
            <artist-container></artist-container>
          </v-card>
        </v-tab-item> -->
      </v-tabs-items>
    </div>
</template>

<script>
import Songs from './Songs/Songs.vue';
import albumContainer from './albumContainer.vue';
import artistContainer from './artistContainer.vue';
import {stateProps, mutationTypes} from '../../assets/data/constants';
import config from '../../app-config/config';

export default {
  components: {
    Songs,
    albumContainer,
    artistContainer,
  },
  // props: [
  //   'config',
  // ],
  data() {
    return {
      tabComponents: [
        'songs', 'album-container', 'artist-container',
      ],
    };
  },
  computed: {
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
        return this.$store.state[stateProps.Tabs];
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
.noOpactiy {
  opacity: 0;
}

.position-absolute {
  position: absolute;
}

.tabs .v-window__container {
    height: 100%;
}

/* .tabs {
    background-color: #111;
} */
</style>

