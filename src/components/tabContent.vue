<template>
    <div class="tabs">
      <v-tabs-items v-model="tab"
        class="full-width full-height"
        :class="{noOpactiy: !Tabs}"
      >
        <v-tab-item class="full-height overflow">
          <v-card flat color="transparent" dark>
            <songs-container></songs-container>
          </v-card>
        </v-tab-item>
        <v-tab-item class="full-height overflow">
          <v-card flat color="transparent" dark>
            <album-container></album-container>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
</template>

<script>
import songsContainer from './songsContainer.vue';
import albumContainer from './albumContainer.vue';


import {stateProps, mutationTypes} from '../assets/js/constants';


export default {
    components: {
        songsContainer,
        albumContainer
    },
    data: function() {
        return {
            
        };
    },
    props: [
        'config'
    ],
    computed: {
        tab: {
            get: function() {
                return this.$store.state[stateProps.tab];
            },
            set: function(newValue) {
                this.$store.commit(mutationTypes.SWITCH_TABS, {
                    newValue
                });
            }
        },
        Tabs: {
            get: function() {
                return this.$store.state[stateProps.Tabs];
            },
            set: function(newValue) {
                return this.$store.commit(mutationTypes.CHANGE_TABS_VISIBILITY, {
                    newValue
                });
            }
        }
    },
    methods: {
        
        
        
    }
}
</script>

<style scoped>
.noOpactiy {
  opacity: 0;
}

.position-absolute {
  position: absolute;
}

/* .tabs {
    background-color: #111;
} */
</style>

