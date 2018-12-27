<template>
    <v-menu 
        bottom
        transition="slide-y-transition"
      >
        <v-btn
          slot="activator"
          dark
          icon
        >
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile
            v-for="(item, i) in moreMenuItems"
            :key="i"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    data: function() {
        return {
            moreMenuItems: [
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me' },
                { title: 'Click Me 2' }
            ]
        }
    }
}
</script>
